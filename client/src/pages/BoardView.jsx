import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
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
  { id: 'done', title: 'Done', dot: styles.dotDone }
];

// ── Sortable Task Card ──
function SortableTaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: { status: task.status }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const priorityClass = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow
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
          <button className={styles.taskActionBtn}
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            aria-label="Edit task"><IoCreateOutline /></button>
          <button className={`${styles.taskActionBtn} ${styles.danger}`}
            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
            aria-label="Delete task"><IoTrashOutline /></button>
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
          <span className={styles.effortBadge}><IoTimeOutline /> {task.estimatedEffort}</span>
        )}
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
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [boardRes, tasksRes] = await Promise.all([
        getBoard(boardId),
        getTasks(boardId)
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
      result = result.filter(t => t.title.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s));
    }
    if (filterPriority) result = result.filter(t => t.priority === filterPriority);
    if (sortBy === 'dueDate') result.sort((a, b) => (a.dueDate || '9') > (b.dueDate || '9') ? 1 : -1);
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    return result;
  }, [tasks, search, filterPriority, sortBy]);

  const getColumnTasks = (status) => filteredTasks.filter(t => t.status === status);

  // ── CRUD handlers ──
  const handleCreateTask = async (data) => {
    const res = await createTask(boardId, { ...data, status: taskModal.status });
    setTasks(prev => [...prev, res.data.data]);
    toast.success('Task created', `"${data.title}" added`);
    fetchBoards();
  };

  const handleUpdateTask = async (data) => {
    const res = await updateTask(boardId, taskModal.task._id, data);
    setTasks(prev => prev.map(t => t._id === taskModal.task._id ? res.data.data : t));
    toast.success('Task updated', `"${data.title}" saved`);
    fetchBoards();
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(boardId, deleteTarget._id);
      setTasks(prev => prev.filter(t => t._id !== deleteTarget._id));
      toast.success('Task deleted', `"${deleteTarget.title}" removed`);
      fetchBoards();
    } catch {
      toast.error('Error', 'Failed to delete task');
    }
    setDeleteTarget(null);
  };

  // ── Drag & Drop ──
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = active.id;
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    // Determine target column
    let targetStatus;
    let targetPosition = 0;

    // Check if dropped over a task
    const overTask = tasks.find(t => t._id === over.id);
    if (overTask) {
      targetStatus = overTask.status;
      targetPosition = overTask.position;
    } else {
      // Dropped on a column droppable
      targetStatus = over.id;
      const colTasks = tasks.filter(t => t.status === targetStatus);
      targetPosition = colTasks.length;
    }

    if (!targetStatus) return;
    if (task.status === targetStatus && task.position === targetPosition) return;

    // Optimistic update
    const updatedTasks = tasks.map(t =>
      t._id === taskId ? { ...t, status: targetStatus, position: targetPosition } : t
    );
    setTasks(updatedTasks);

    try {
      await moveTask(boardId, taskId, { status: targetStatus, position: targetPosition });
      // Refetch for accurate positions
      const res = await getTasks(boardId);
      setTasks(res.data.data);
      fetchBoards();
    } catch {
      toast.error('Error', 'Failed to move task');
      fetchData();
    }
  };

  const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}><Skeleton variant="title" width="250px" /></div>
        <div className={styles.kanban}>
          {[1,2,3].map(i => <Skeleton key={i} variant="card" height="400px" />)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="Back to dashboard">
            <IoArrowBack />
          </button>
          <h1 className={styles.boardTitle}>{board?.title}</h1>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <IoSearchOutline className={styles.searchIcon} />
            <input className={styles.searchInput} type="text" placeholder="Search tasks..."
              value={search} onChange={(e) => setSearch(e.target.value)} id="task-search" />
          </div>
          <select className={styles.filterSelect} value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)} id="filter-priority">
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className={styles.filterSelect} value={sortBy}
            onChange={(e) => setSortBy(e.target.value)} id="sort-by">
            <option value="">Default Sort</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter}
        onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.kanban}>
          {COLUMNS.map(col => {
            const colTasks = getColumnTasks(col.id);
            return (
              <div key={col.id} className={styles.column} id={`column-${col.id}`}>
                <div className={styles.columnHeader}>
                  <span className={styles.columnTitle}>
                    <span className={`${styles.columnDot} ${col.dot}`} />
                    {col.title}
                  </span>
                  <span className={styles.columnCount}>{colTasks.length}</span>
                </div>

                <div className={styles.columnBody}>
                  <SortableContext items={colTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {colTasks.length === 0 ? (
                      <div className={styles.columnEmpty}>No tasks here yet</div>
                    ) : (
                      colTasks.map(task => (
                        <SortableTaskCard
                          key={task._id}
                          task={task}
                          onEdit={(t) => setTaskModal({ open: true, mode: 'edit', task: t, status: t.status })}
                          onDelete={(t) => setDeleteTarget(t)}
                        />
                      ))
                    )}
                  </SortableContext>
                </div>

                <button className={styles.addTaskBtn}
                  onClick={() => setTaskModal({ open: true, mode: 'create', task: null, status: col.id })}
                  id={`add-task-${col.id}`}>
                  <IoAdd /> Add Task
                </button>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className={styles.taskCard} style={{ opacity: 0.9, boxShadow: 'var(--shadow-lg)' }}>
              <div className={styles.taskCardHeader}>
                <span className={styles.taskTitle}>{activeTask.title}</span>
              </div>
              <div className={styles.taskMeta}>
                <span className={`${styles.priorityBadge} ${
                  { high: styles.priorityHigh, medium: styles.priorityMedium, low: styles.priorityLow }[activeTask.priority]
                }`}>{activeTask.priority}</span>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModal.open}
        onClose={() => setTaskModal({ open: false, mode: 'create', task: null, status: 'todo' })}
        onSubmit={taskModal.mode === 'edit' ? handleUpdateTask : handleCreateTask}
        onDelete={taskModal.mode === 'edit' ? (id) => { setDeleteTarget(tasks.find(t => t._id === id)); } : null}
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
