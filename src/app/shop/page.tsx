import styles from "./page.module.css";

export default function Shop() {
  return (
    <div className={styles.shop}>
      <div className={styles.main}>
        <span>Shop</span>
        <div className={styles.goHome}></div>
      </div>
    </div>
  );
}
