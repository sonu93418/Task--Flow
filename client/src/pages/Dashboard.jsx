import { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import {
  IoAdd, IoTrashOutline, IoCreateOutline, IoCalendarOutline,
  IoLayersOutline, IoCheckmarkDone, IoTimeOutline, IoWarning, IoList
} from 'react-icons/io5';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/UI/Toast';
import { deleteBoard as deleteBoardApi, updateBoard as updateBoardApi } from '../api/boards';
import { getTasks } from '../api/tasks';
import Modal from '../components/UI/Modal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import Skeleton from '../components/UI/Skeleton';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { boards, setBoards, fetchBoards } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBoards();
      setLoading(false);
    };
    loadData();
  }, [fetchBoards]);

  // Fetch all tasks for stats
  useEffect(() => {
    const fetchAllTasks = async () => {
      if (boards.length === 0) { setAllTasks([]); return; }
      try {
        const results = await Promise.all(boards.map(b => getTasks(b._id)));
        const tasks = results.flatMap(r => r.data.data);
        setAllTasks(tasks);
      } catch { /* ignore */ }
    };
    if (!loading) fetchAllTasks();
  }, [boards, loading]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const todo = allTasks.filter(t => t.status === 'todo').length;
    const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
    const done = allTasks.filter(t => t.status === 'done').length;
    const overdue = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;
    return { todo, inProgress, done, overdue, total: allTasks.length };
  }, [allTasks]);

  const statusChartData = useMemo(() => [
    { name: 'To Do',      value: stats.todo,       fill: '#6366f1' },
    { name: 'In Progress',value: stats.inProgress, fill: '#f59e0b' },
    { name: 'Done',       value: stats.done,       fill: '#14b8a6' }
  ], [stats]);

  const priorityChartData = useMemo(() => {
    const high = allTasks.filter(t => t.priority === 'high').length;
    const med  = allTasks.filter(t => t.priority === 'medium').length;
    const low  = allTasks.filter(t => t.priority === 'low').length;
    return [
      { name: 'High',   count: high, fill: '#ef4444' },
      { name: 'Medium', count: med,  fill: '#f59e0b' },
      { name: 'Low',    count: low,  fill: '#14b8a6' }
    ];
  }, [allTasks]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBoardApi(deleteTarget._id);
      setBoards(prev => prev.filter(b => b._id !== deleteTarget._id));
      toast.success('Board deleted', `"${deleteTarget.title}" has been removed`);
    } catch (err) {
      toast.error('Error', err.response?.data?.message || 'Failed to delete board');
    }
    setDeleteTarget(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      const res = await updateBoardApi(editTarget._id, { title: editTitle.trim(), description: editDesc.trim() });
      setBoards(prev => prev.map(b => b._id === editTarget._id ? { ...b, ...res.data.data } : b));
      toast.success('Board updated', `"${editTitle}" saved`);
      setEditTarget(null);
    } catch (err) {
      toast.error('Error', err.response?.data?.message || 'Failed to update board');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}><Skeleton variant="title" width="300px" /></div>
        <div className={styles.loadingGrid}>
          {[1,2,3].map(i => <Skeleton key={i} variant="card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Good day, <span className={styles.greetingAccent}>{user?.name}</span>
          </h1>
          <p className={styles.headerSub}>
            {boards.length} {boards.length === 1 ? 'board' : 'boards'} &middot; {stats.total} tasks total
          </p>
        </div>
        <button className={styles.createBtn} onClick={() => document.getElementById('create-board-btn')?.click()}>
          <IoAdd /> New Board
        </button>
      </div>

      {/* Stats */}
      {allTasks.length > 0 && (
        <>
          <div className={styles.statGrid}>
            <div className={`${styles.statCard} ${styles.statTodo}`}>
              <div className={styles.statIconRow}>
                <div className={styles.statIcon}><IoList /></div>
              </div>
              <div className={styles.statNumber}>{stats.todo}</div>
              <div className={styles.statLabel}>To Do</div>
            </div>
            <div className={`${styles.statCard} ${styles.statProgress}`}>
              <div className={styles.statIconRow}>
                <div className={styles.statIcon}><IoTimeOutline /></div>
              </div>
              <div className={styles.statNumber}>{stats.inProgress}</div>
              <div className={styles.statLabel}>In Progress</div>
            </div>
            <div className={`${styles.statCard} ${styles.statDone}`}>
              <div className={styles.statIconRow}>
                <div className={styles.statIcon}><IoCheckmarkDone /></div>
              </div>
              <div className={styles.statNumber}>{stats.done}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={`${styles.statCard} ${styles.statOverdue}`}>
              <div className={styles.statIconRow}>
                <div className={styles.statIcon}><IoWarning /></div>
              </div>
              <div className={styles.statNumber}>{stats.overdue}</div>
              <div className={styles.statLabel}>Overdue</div>
            </div>
          </div>

          <div className={styles.chartsSection}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Tasks by Status</div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusChartData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={4} strokeWidth={0}>
                    {statusChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Tasks by Priority</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priorityChartData}>
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {priorityChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <IoLayersOutline /> Your Boards
          {boards.length > 0 && <span className={styles.sectionCount}>{boards.length}</span>}
        </h2>
      </div>

      {boards.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏯</div>
          <h2 className={styles.emptyTitle}>Your zen garden awaits</h2>
          <p className={styles.emptySubtitle}>
            Create your first board to start organizing tasks with the tranquility of a Japanese garden.
          </p>
        </div>
      ) : (
        <div className={styles.boardGrid}>
          {boards.map(board => (
            <div key={board._id} className={styles.boardCard}>
              <div className={styles.boardCardHeader}>
                <Link to={`/board/${board._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <h3 className={styles.boardTitle}>{board.title}</h3>
                </Link>
                <div className={styles.boardActions}>
                  <button
                    className={styles.boardActionBtn}
                    onClick={(e) => { e.stopPropagation(); setEditTarget(board); setEditTitle(board.title); setEditDesc(board.description || ''); }}
                    aria-label="Edit board"
                  >
                    <IoCreateOutline />
                  </button>
                  <button
                    className={`${styles.boardActionBtn} ${styles.danger}`}
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(board); }}
                    aria-label="Delete board"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              </div>

              <Link to={`/board/${board._id}`} style={{ textDecoration: 'none' }}>
                {board.description && <p className={styles.boardDesc}>{board.description}</p>}
                <div className={styles.boardMeta}>
                  <span className={styles.boardMetaItem}>
                    <IoCalendarOutline /> {formatDate(board.createdAt)}
                  </span>
                  <span className={styles.boardMetaItem}>
                    <IoLayersOutline /> {board.taskCounts?.total || 0} tasks
                  </span>
                </div>
                {board.taskCounts && board.taskCounts.total > 0 && (
                  <div className={styles.taskBadges}>
                    {board.taskCounts.todo > 0 && <span className={`${styles.taskBadge} ${styles.badgeTodo}`}>{board.taskCounts.todo} to do</span>}
                    {board.taskCounts['in-progress'] > 0 && <span className={`${styles.taskBadge} ${styles.badgeProgress}`}>{board.taskCounts['in-progress']} active</span>}
                    {board.taskCounts.done > 0 && <span className={`${styles.taskBadge} ${styles.badgeDone}`}>{board.taskCounts.done} done</span>}
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Edit Board Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Board">
        <form onSubmit={handleEdit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Title</label>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 'var(--font-size-base)', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3}
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 'var(--font-size-base)', resize: 'vertical', fontFamily: 'var(--font-sans)', outline: 'none' }}
            />
          </div>
          <button type="submit"
            style={{ width: '100%', padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-md)', background: '#6366f1', color: 'white', fontWeight: 700, fontSize: 'var(--font-size-base)', cursor: 'pointer', border: 'none', boxShadow: '0 3px 12px rgba(99,102,241,0.35)', transition: 'background 0.2s' }}>
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Board?"
        message={`This will permanently delete "${deleteTarget?.title}" and all its tasks. This action cannot be undone.`}
      />
    </div>
  );
}
