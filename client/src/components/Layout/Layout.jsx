import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Modal from '../UI/Modal';
import { useToast } from '../UI/Toast';
import { getBoards, createBoard as createBoardApi } from '../../api/boards';
import styles from './Layout.module.css';

export default function Layout() {
  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  const fetchBoards = useCallback(async () => {
    try {
      const res = await getBoards();
      setBoards(res.data.data);
    } catch (err) {
      console.error('Failed to fetch boards:', err);
    }
  }, []);

  useEffect(() => { fetchBoards(); }, [fetchBoards]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    setCreating(true);
    try {
      const res = await createBoardApi({ title: newBoardTitle.trim(), description: newBoardDesc.trim() });
      setBoards(prev => [res.data.data, ...prev]);
      setShowCreateModal(false);
      setNewBoardTitle('');
      setNewBoardDesc('');
      toast.success('Board created', `"${res.data.data.title}" is ready to use`);
    } catch (err) {
      toast.error('Error', err.response?.data?.message || 'Failed to create board');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        boards={boards}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateBoard={() => setShowCreateModal(true)}
      />
      <main className={styles.mainContent}>
        <Outlet context={{ boards, setBoards, fetchBoards }} />
      </main>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Board">
        <form onSubmit={handleCreateBoard}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
              Board Title
            </label>
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="e.g., Project Alpha"
              autoFocus
              required
              style={{
                width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)',
                fontSize: 'var(--font-size-base)', transition: 'border-color var(--transition-fast)',
                outline: 'none'
              }}
              id="create-board-title"
            />
          </div>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
              Description (optional)
            </label>
            <textarea
              value={newBoardDesc}
              onChange={(e) => setNewBoardDesc(e.target.value)}
              placeholder="What is this board for?"
              rows={3}
              style={{
                width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)',
                fontSize: 'var(--font-size-base)', resize: 'vertical', fontFamily: 'var(--font-sans)',
                outline: 'none'
              }}
              id="create-board-description"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !newBoardTitle.trim()}
            style={{
              width: '100%', padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--sakura-deep), var(--indigo))',
              color: 'white', fontWeight: 600, fontSize: 'var(--font-size-base)',
              transition: 'all var(--transition-fast)', opacity: creating ? 0.7 : 1,
              cursor: creating ? 'not-allowed' : 'pointer'
            }}
            id="create-board-submit"
          >
            {creating ? 'Creating...' : '🌸 Create Board'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
