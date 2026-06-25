import styles from './Skeleton.module.css';

export default function Skeleton({ variant = 'text', width, height, style = {} }) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]}`}
      style={{ width, height, ...style }}
    />
  );
}
