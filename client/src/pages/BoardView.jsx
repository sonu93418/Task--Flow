import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
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

const COLUMNS = [
  { id: 'todo', title: 'To Do', dot: styles.dotTodo },
  { id: 'in-progress', title: 'In Progress', dot: styles.dotProgress },
  { id: 'done', title: 'Done', dot: styles.dotDone },
];

const COLUMN_IDS = COLUMNS.map((c) => c.id);

// ── Droppable Column Body ──
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

// ── Sortable Task Card ──
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const priorityClass = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow,
  }[task.priority] || styles.priorityMedium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.taskCard} ${isDragging ? styles.taskDragging : ''}`}
    >
      <div className={styles.taskCardHeader}>
        <span className={styles.taskTitle}>{task.title}</span>
        <div className={styles.taskActions}>
          <button
            className={styles.taskActionBtn}
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            aria-label="Edit task"
          >
            <IoCreateOutline />
          </button>
          <button
            className={`${styles.taskActionBtn} ${styles.danger}`}
            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
            aria-label="Delete task"
          >
            <IoTrashOutline />
          </button>
        </div>
      </div>

      {task.description && <p className={styles.taskDesc}>{task.description}</p>}

      <div className={styles.taskMeta}>
        <span className={`${styles.priorityBadge} ${priorityClass}`}>{task.priority}</span>
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
  );
}

// ── Drag Overlay Card ──
function OverlayCard({ task }) {
  const priorityClass = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow,
  }[task.priority] || styles.priorityMedium;

  return (
    <div className={`${styles.taskCard} ${styles.taskOverlay}`}>
      <div className={styles.taskCardHeader}>
        <span className={styles.taskTitle}>{task.title}</span>
      </div>
      {task.description && <p className={styles.taskDesc}>{task.description}</p>}
      <div className={styles.taskMeta}>
        <span className={`${styles.priorityBadge} ${priorityClass}`}>{task.priority}</span>
      </div>
    </div>
  );
}

// ── Main Board View ──
export default function BoardView() {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const { fetchBoards } = useOutletContext();
  const toast = useToast();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [taskModal, setTaskModal] = useState({ open: false, mode: 'create', task: null, status: 'todo' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Active dragging state
  const [activeTask, setActiveTask] = useState(null);
  const [overColumnId, setOverColumnId] = useState(null);

  // Snapshot for rollback
  const tasksSnapshot = useRef([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

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

  // Filter & sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s)
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

  // ── CRUD handlers ──
  const handleCreateTask = async (data) => {
    const res = await createTask(boardId, { ...data, status: taskModal.status });
    setTasks((prev) => [...prev, res.data.data]);
    toast.success('Task created', `"${data.title}" added`);
    fetchBoards();
  };

  const handleUpdateTask = async (data) => {
    const res = await updateTask(boardId, taskModal.task._id, data);
    setTasks((prev) =>
      prev.map((t) => (t._id === taskModal.task._id ? res.data.data : t))
    );
    toast.success('Task updated', `"${data.title}" saved`);
    fetchBoards();
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

  // ── Drag helpers ──

  // Resolve which column ID an "over" target belongs to
  const resolveTargetColumn = (over, currentTasks) => {
    if (!over) return null;
    if (COLUMN_IDS.includes(over.id)) return over.id;
    const overTask = currentTasks.find((t) => t._id === over.id);
    return overTask ? overTask.status : null;
  };

  // ── onDragStart ──
  const handleDragStart = ({ active }) => {
    const task = tasks.find((t) => t._id === active.id);
    if (!task) return;
    tasksSnapshot.current = tasks; // save snapshot
    setActiveTask(task);
  };

  // ── onDragOver: live cross-column move ──
  const handleDragOver = ({ active, over }) => {
    const targetColumn = resolveTargetColumn(over, tasks);
    setOverColumnId(targetColumn);

    if (!targetColumn || !activeTask) return;
    if (activeTask.status === targetColumn) return; // same column — sortable handles

    // Optimistically move task to new column
    setTasks((prev) =>
      prev.map((t) =>
        t._id === active.id ? { ...t, status: targetColumn } : t
      )
    );
    setActiveTask((prev) => ({ ...prev, status: targetColumn }));
  };

  // ── onDragEnd ──
  const handleDragEnd = async ({ active, over }) => {
    const task = tasksSnapshot.current.find((t) => t._id === active.id);
    setActiveTask(null);
    setOverColumnId(null);

    if (!over || !task) {
      setTasks(tasksSnapshot.current);
      return;
    }

    const targetColumn = resolveTargetColumn(over, tasks);
    if (!targetColumn) {
      setTasks(tasksSnapshot.current);
      return;
    }

    const colTasks = tasks.filter((t) => t.status === targetColumn);
    const posIdx = colTasks.findIndex((t) => t._id === active.id);
    const targetPosition = posIdx >= 0 ? posIdx : colTasks.length;

    // No real change
    if (task.status === targetColumn && task.position === targetPosition) return;

    try {
      await moveTask(boardId, active.id, { status: targetColumn, position: targetPosition });
      const res = await getTasks(boardId);
      setTasks(res.data.data);
      fetchBoards();
    } catch {
      toast.error('Error', 'Failed to move task');
      setTasks(tasksSnapshot.current);
    }
  };

  // ── onDragCancel ──
  const handleDragCancel = () => {
    setActiveTask(null);
    setOverColumnId(null);
    setTasks(tasksSnapshot.current);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}><Skeleton variant="title" width="250px" /></div>
        <div className={styles.kanban}>
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="card" height="400px" />)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/')}
            aria-label="Back to dashboard"
          >
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
            <option value="">All Priorities</option>
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
            <option value="">Default Sort</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className={styles.kanban}>
          {COLUMNS.map((col) => {
            const colTasks = getColumnTasks(col.id);
            const isOver = overColumnId === col.id;

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
                      <div
                        className={`${styles.columnEmpty} ${isOver ? styles.columnEmptyOver : ''}`}
                      >
                        {isOver ? '✦ Drop here' : 'No tasks here yet'}
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

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeTask ? <OverlayCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task?"
        message={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
      />
    </div>
  );
}
