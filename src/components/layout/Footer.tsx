import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.text}>
          &copy; {new Date().getFullYear()} CoreFlow Pilates. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
