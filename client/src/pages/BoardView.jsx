import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IoArrowBack, IoAdd, IoSearchOutline, IoCreateOutline,
  IoTrashOutline, IoCalendarOutline, IoTimeOutline
} from 'react-icons/io5';
import { getBoard } from '../api/boards';
import { getTasks, createTask, updateTask, deleteTask, moveTask } from '../api/tasks';
import { useToast } from '../components/UI/Toast';
import TaskModal from '../components/Task/TaskModal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import Skeleton from '../components/UI/Skeleton';
import styles from './BoardView.module.css';
import confetti from 'canvas-confetti';

/* ── Confetti ────────────────────────────────────────────────────────────── */
const triggerConfetti = () => {
  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  const end = Date.now() + 1500;
  const colors = ['#6366f1', '#e879a0', '#10b981', '#f59e0b'];
  (function frame() {
    confetti({ particleCount: 2, angle: 60,  spread: 55, origin: { x: 0, y: 0.8 }, colors });
    confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
};

/* ── Constants ───────────────────────────────────────────────────────────── */
const COLUMNS = [
  { id: 'todo',        title: 'To Do',      dot: styles.dotTodo },
  { id: 'in-progress', title: 'In Progress', dot: styles.dotProgress },
  { id: 'done',        title: 'Done',        dot: styles.dotDone },
];
const COLUMN_IDS = COLUMNS.map((c) => c.id);

/* ── Droppable column body ───────────────────────────────────────────────── */
function DroppableColumnBody({ id, isOver, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${styles.columnBody} ${isOver ? styles.columnBodyOver : ''}`}
    >
      {children}
    </div>
  );
}

/* ── Sortable task card ──────────────────────────────────────────────────────
 *
 * Design decision: the WHOLE card is the drag activator.
 * - PointerSensor fires after 8px movement → short taps are still clicks
 * - TouchSensor fires after 200ms hold → scrolling still works
 * - touchAction: 'manipulation' on the card allows the browser to handle
 *   double-tap zoom suppression while still letting our sensor intercept
 *   the touch sequence once the delay elapses
 * - Action buttons use onPointerDown stopPropagation so they NEVER start a drag
 *
 * ──────────────────────────────────────────────────────────────────────────── */
function SortableTaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: 'task', status: task.status },
  });

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const priorityClass = {
    high:   styles.priorityHigh,
    medium: styles.priorityMedium,
    low:    styles.priorityLow,
  }[task.priority] || styles.priorityMedium;

  return (
    <div
      ref={setNodeRef}
      /* Spread listeners on the whole card so the entire surface is draggable.
         The PointerSensor distance:8 + TouchSensor delay:200 constraints mean
         short taps/clicks still reach child buttons. */
      {...listeners}
      {...attributes}
      className={`${styles.taskCard} ${isDragging ? styles.taskDragging : ''}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
        /* GPU-composite the card during drag for smooth 60fps movement */
        willChange: isDragging ? 'transform' : undefined,
        /* Allow tap/click events through; prevent only multi-touch/scroll
           gestures from hijacking the drag sequence */
        touchAction: 'manipulation',
      }}
    >
      {/* Drag affordance indicator — purely visual, not interactive */}
      <div className={styles.dragGrip} aria-hidden="true">
        <span>⋮⋮</span>
      </div>

      <div className={styles.taskCardInner}>
        <div className={styles.taskCardHeader}>
          <span className={styles.taskTitle}>{task.title}</span>
          <div className={styles.taskActions}>
            {/* stopPropagation on pointerdown prevents the sensor from
                treating the button press as the start of a drag */}
            <button
              className={styles.taskActionBtn}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              aria-label="Edit task"
            >
              <IoCreateOutline />
            </button>
            <button
              className={`${styles.taskActionBtn} ${styles.danger}`}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(task); }}
              aria-label="Delete task"
            >
              <IoTrashOutline />
            </button>
          </div>
        </div>

        {task.description && (
          <p className={styles.taskDesc}>{task.description}</p>
        )}

        <div className={styles.taskMeta}>
          <span className={`${styles.priorityBadge} ${priorityClass}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`${styles.dueBadge} ${isOverdue ? styles.dueOverdue : ''}`}>
              <IoCalendarOutline /> {formatDate(task.dueDate)} {isOverdue && '⚠'}
            </span>
          )}
          {task.estimatedEffort && (
            <span className={styles.effortBadge}>
              <IoTimeOutline /> {task.estimatedEffort}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Overlay ghost card (rendered at cursor level during drag) ───────────── */
function OverlayCard({ task }) {
  const priorityClass = {
    high:   styles.priorityHigh,
    medium: styles.priorityMedium,
    low:    styles.priorityLow,
  }[task.priority] || styles.priorityMedium;

  return (
    <div className={`${styles.taskCard} ${styles.taskOverlay}`}>
      <div className={styles.dragGrip} aria-hidden="true"><span>⋮⋮</span></div>
      <div className={styles.taskCardInner}>
        <div className={styles.taskCardHeader}>
          <span className={styles.taskTitle}>{task.title}</span>
        </div>
        {task.description && <p className={styles.taskDesc}>{task.description}</p>}
        <div className={styles.taskMeta}>
          <span className={`${styles.priorityBadge} ${priorityClass}`}>{task.priority}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function BoardView() {
  const { id: boardId } = useParams();
  const navigate        = useNavigate();
  const { fetchBoards } = useOutletContext();
  const toast           = useToast();

  const [board,          setBoard]          = useState(null);
  const [tasks,          setTasks]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy,         setSortBy]         = useState('');
  const [taskModal,      setTaskModal]      = useState({
    open: false, mode: 'create', task: null, status: 'todo',
  });
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [activeTask,    setActiveTask]    = useState(null);
  const [overColumnId,  setOverColumnId]  = useState(null);

  /* Keep a ref to latest tasks so drag handlers never read stale state */
  const tasksRef     = useRef(tasks);
  const snapshotRef  = useRef([]);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  /* ── Sensors ─────────────────────────────────────────────────────────────
   * PointerSensor: mouse / stylus — activates after 8px movement.
   *   This means a click (< 8px) is never treated as drag.
   * TouchSensor: finger — activates after 200ms press with max 8px drift.
   *   Short taps trigger the click handler normally.
   *   Long press (≥200ms) starts the drag.
   * KeyboardSensor: accessibility.
   * ───────────────────────────────────────────────────────────────────────── */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* ── Data fetching ─────────────────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [boardRes, tasksRes] = await Promise.all([
        getBoard(boardId),
        getTasks(boardId),
      ]);
      setBoard(boardRes.data.data);
      setTasks(tasksRes.data.data);
    } catch {
      toast.error('Error', 'Failed to load board');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [boardId, navigate, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Filtered / sorted task list ──────────────────────────────────────── */
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(s) ||
               t.description?.toLowerCase().includes(s)
      );
    }
    if (filterPriority) result = result.filter((t) => t.priority === filterPriority);
    if (sortBy === 'dueDate')
      result.sort((a, b) => (a.dueDate || '9') > (b.dueDate || '9') ? 1 : -1);
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    return result;
  }, [tasks, search, filterPriority, sortBy]);

  const getColumnTasks = (status) => filteredTasks.filter((t) => t.status === status);

  /* ── CRUD ────────────────────────────────────────────────────────────────── */
  const handleCreateTask = async (data) => {
    const res = await createTask(boardId, { ...data, status: taskModal.status });
    setTasks((prev) => [...prev, res.data.data]);
    toast.success('Task created', `"${data.title}" added`);
    fetchBoards();
  };

  const handleUpdateTask = async (data) => {
    const originalTask = taskModal.task;
    const res = await updateTask(boardId, taskModal.task._id, data);
    setTasks((prev) => prev.map((t) => t._id === taskModal.task._id ? res.data.data : t));
    toast.success('Task updated', `"${data.title}" saved`);
    fetchBoards();
    if (originalTask?.status !== 'done' && data.status === 'done') triggerConfetti();
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(boardId, deleteTarget._id);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      toast.success('Task deleted', `"${deleteTarget.title}" removed`);
      fetchBoards();
    } catch {
      toast.error('Error', 'Failed to delete task');
    }
    setDeleteTarget(null);
  };

  /* ── Drag helpers ─────────────────────────────────────────────────────────
   * All handlers read from tasksRef.current (always fresh) instead of
   * the stale `tasks` closure value.
   * ───────────────────────────────────────────────────────────────────────── */
  const resolveTargetColumn = (over) => {
    if (!over) return null;
    if (COLUMN_IDS.includes(over.id)) return over.id;
    const overTask = tasksRef.current.find((t) => t._id === over.id);
    return overTask ? overTask.status : null;
  };

  const handleDragStart = ({ active }) => {
    const task = tasksRef.current.find((t) => t._id === active.id);
    if (!task) return;
    /* Snapshot before any optimistic updates */
    snapshotRef.current = [...tasksRef.current];
    setActiveTask(task);
  };

  const handleDragOver = ({ active, over }) => {
    const targetColumn = resolveTargetColumn(over);
    setOverColumnId(targetColumn);

    if (!targetColumn) return;

    /* Read from ref — no stale closure */
    const currentStatus = tasksRef.current.find((t) => t._id === active.id)?.status;
    if (!currentStatus || currentStatus === targetColumn) return;

    /* Optimistic cross-column move */
    setTasks((prev) =>
      prev.map((t) => t._id === active.id ? { ...t, status: targetColumn } : t)
    );
    setActiveTask((prev) => prev ? { ...prev, status: targetColumn } : prev);
  };

  const handleDragEnd = async ({ active, over }) => {
    const originalTask = snapshotRef.current.find((t) => t._id === active.id);
    setActiveTask(null);
    setOverColumnId(null);

    if (!over || !originalTask) {
      setTasks(snapshotRef.current);
      return;
    }

    const targetColumn = resolveTargetColumn(over);
    if (!targetColumn) {
      setTasks(snapshotRef.current);
      return;
    }

    /* Position within the destination column */
    const colTasks       = tasksRef.current.filter((t) => t.status === targetColumn);
    const posIdx         = colTasks.findIndex((t) => t._id === active.id);
    const targetPosition = posIdx >= 0 ? posIdx : colTasks.length;

    /* Nothing actually changed */
    if (originalTask.status === targetColumn && originalTask.position === targetPosition) return;

    try {
      await moveTask(boardId, active.id, { status: targetColumn, position: targetPosition });
      /* Refresh from server for authoritative order */
      const res = await getTasks(boardId);
      setTasks(res.data.data);
      fetchBoards();
      if (originalTask.status !== 'done' && targetColumn === 'done') triggerConfetti();
    } catch {
      toast.error('Error', 'Failed to move task');
      setTasks(snapshotRef.current);
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setOverColumnId(null);
    setTasks(snapshotRef.current);
  };

  /* ── Render ──────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Skeleton variant="title" width="250px" />
        </div>
        <div className={styles.kanbanWrapper}>
          <div className={styles.kanban}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="card" height="400px" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Back">
            <IoArrowBack />
          </button>
          <h1 className={styles.boardTitle}>{board?.title}</h1>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="task-search"
            />
          </div>
          <select
            className={styles.filterSelect}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            id="filter-priority"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-by"
          >
            <option value="">Sort</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className={styles.kanbanWrapper}>
          <div className={styles.kanban}>
            {COLUMNS.map((col) => {
              const colTasks = getColumnTasks(col.id);
              const isOver   = overColumnId === col.id;

              return (
                <div
                  key={col.id}
                  className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
                  id={`column-${col.id}`}
                >
                  <div className={styles.columnHeader}>
                    <span className={styles.columnTitle}>
                      <span className={`${styles.columnDot} ${col.dot}`} />
                      {col.title}
                    </span>
                    <span className={styles.columnCount}>{colTasks.length}</span>
                  </div>

                  <SortableContext
                    items={colTasks.map((t) => t._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumnBody id={col.id} isOver={isOver}>
                      {colTasks.length === 0 ? (
                        <div className={`${styles.columnEmpty} ${isOver ? styles.columnEmptyOver : ''}`}>
                          {isOver ? '✦ Drop here' : 'No tasks yet'}
                        </div>
                      ) : (
                        colTasks.map((task) => (
                          <SortableTaskCard
                            key={task._id}
                            task={task}
                            onEdit={(t) =>
                              setTaskModal({ open: true, mode: 'edit', task: t, status: t.status })
                            }
                            onDelete={(t) => setDeleteTarget(t)}
                          />
                        ))
                      )}
                    </DroppableColumnBody>
                  </SortableContext>

                  <button
                    className={styles.addTaskBtn}
                    onClick={() =>
                      setTaskModal({ open: true, mode: 'create', task: null, status: col.id })
                    }
                    id={`add-task-${col.id}`}
                  >
                    <IoAdd /> Add Task
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 180,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeTask ? <OverlayCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <TaskModal
        isOpen={taskModal.open}
        onClose={() =>
          setTaskModal({ open: false, mode: 'create', task: null, status: 'todo' })
        }
        onSubmit={taskModal.mode === 'edit' ? handleUpdateTask : handleCreateTask}
        onDelete={
          taskModal.mode === 'edit'
            ? (id) => { setDeleteTarget(tasks.find((t) => t._id === id)); }
            : null
        }
        task={taskModal.task}
        mode={taskModal.mode}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task?"
        message={`Permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
