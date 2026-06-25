import { IoWarning } from 'react-icons/io5';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}><IoWarning /></div>
        <h3 className={styles.title}>{title || 'Are you sure?'}</h3>
        <p className={styles.message}>{message || 'This action cannot be undone.'}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.confirmBtn} onClick={() => { onConfirm(); onClose(); }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
