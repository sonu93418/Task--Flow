import { Link } from 'react-router-dom';
import { IoMenu, IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../UI/ThemeToggle';
import styles from './Navbar.module.css';
import logoSvg from '../../assets/logo.svg';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar} id="main-navbar">
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <IoMenu />
        </button>
        <Link to="/" className={styles.logo}>
          <img src={logoSvg} className={styles.logoImg} alt="TaskFlow" />
          <span className={styles.logoText}>
            Task<span className={styles.logoAccent}>Flow</span>
          </span>
        </Link>
      </div>

      <div className={styles.right}>
        <ThemeToggle />
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={logout} id="logout-button">
              <IoLogOutOutline />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
