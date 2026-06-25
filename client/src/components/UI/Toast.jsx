import { createContext, useContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoAlertCircle, IoInformationCircle, IoClose } from 'react-icons/io5';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (title, message) => addToast('success', title, message),
    error: (title, message) => addToast('error', title, message),
    info: (title, message) => addToast('info', title, message)
  };

  const icons = {
    success: <IoCheckmarkCircle />,
    error: <IoAlertCircle />,
    info: <IoInformationCircle />
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={styles.container}>
        {toasts.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
            <span className={styles.icon}>{icons[t.type]}</span>
            <div className={styles.content}>
              <div className={styles.toastTitle}>{t.title}</div>
              {t.message && <div className={styles.toastMessage}>{t.message}</div>}
            </div>
            <button className={styles.closeBtn} onClick={() => removeToast(t.id)}>
              <IoClose />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
