import { IoMoon, IoSunny } from 'react-icons/io5';
import { useTheme } from '../../hooks/useTheme';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`${styles.toggle} ${styles[theme]}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className={styles.indicator}>
        {theme === 'dark' ? <IoMoon /> : <IoSunny />}
      </div>
    </button>
  );
}
