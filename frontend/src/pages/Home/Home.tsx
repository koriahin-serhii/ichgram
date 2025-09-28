import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Home</h1>
      <div className={styles.card}>This is a CSS Modules example.</div>
    </div>
  );
}
