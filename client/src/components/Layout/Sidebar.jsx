import { Link, useLocation } from 'react-router-dom';
import { IoGridOutline, IoFolderOutline, IoAdd } from 'react-icons/io5';
import styles from './Sidebar.module.css';

export default function Sidebar({ boards, isOpen, onClose, onCreateBoard }) {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <Link
          to="/"
          className={`${styles.dashboardLink} ${location.pathname === '/' ? styles.dashboardLinkActive : ''}`}
          onClick={onClose}
        >
          <IoGridOutline className={styles.dashboardIcon} />
          <span>Dashboard</span>
        </Link>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Your Boards</span>
            <button className={styles.addBtn} onClick={onCreateBoard} aria-label="Create new board">
              <IoAdd />
            </button>
          </div>

          <div className={styles.boardList}>
            {boards.length === 0 ? (
              <span className={styles.emptyText}>No boards yet</span>
            ) : (
              boards.map(board => (
                <Link
                  key={board._id}
                  to={`/board/${board._id}`}
                  className={`${styles.boardItem} ${location.pathname === `/board/${board._id}` ? styles.boardItemActive : ''}`}
                  onClick={onClose}
                >
                  <IoFolderOutline className={styles.boardIcon} />
                  <span className={styles.boardName}>{board.title}</span>
                  {board.taskCounts && (
                    <span className={styles.taskCount}>{board.taskCounts.total}</span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
