import { Link, useLocation } from 'react-router-dom';
import { IoGridOutline, IoFolderOutline, IoAdd } from 'react-icons/io5';
import styles from './Sidebar.module.css';

export default function Sidebar({ boards, isOpen, onClose, onCreateBoard }) {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside
        className={`${styles.sidebar}${isOpen ? ' ' + styles.sidebarOpen : ''}`}
        aria-label="Navigation sidebar"
      >
        {/* Dashboard nav */}
        <Link
          to="/"
          className={`${styles.dashboardLink}${location.pathname === '/' ? ' ' + styles.dashboardLinkActive : ''}`}
          onClick={onClose}
        >
          <IoGridOutline className={styles.dashboardIcon} />
          <span>Dashboard</span>
        </Link>

        <div className={styles.divider} />

        {/* Boards section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>
              Boards {boards.length > 0 && `· ${boards.length}`}
            </span>
            <button
              className={styles.addBtn}
              onClick={onCreateBoard}
              aria-label="Create new board"
              title="New Board"
            >
              <IoAdd />
            </button>
          </div>

          <div className={styles.boardList}>
            {boards.length === 0 ? (
              <div className={styles.emptyText}>
                No boards yet
              </div>
            ) : (
              boards.map(board => {
                const isActive = location.pathname === '/board/' + board._id;
                return (
                  <Link
                    key={board._id}
                    to={'/board/' + board._id}
                    className={styles.boardItem + (isActive ? ' ' + styles.boardItemActive : '')}
                    onClick={onClose}
                    title={board.title}
                  >
                    <IoFolderOutline className={styles.boardIcon} />
                    <span className={styles.boardName}>{board.title}</span>
                    {board.taskCounts != null && (
                      <span className={styles.taskCount}>
                        {board.taskCounts.total ?? 0}
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* New Board button at bottom */}
        <div style={{ padding: '0 0.75rem', marginTop: 'auto' }}>
          <button
            className={styles.newBoardBtn}
            onClick={onCreateBoard}
            id="create-board-btn"
          >
            <IoAdd />
            <span>New Board</span>
          </button>
        </div>
      </aside>
    </>
  );
}