"use client";

import styles from "./LoadingWithoutPadding.module.css";

export default function LoadingWithoutPadding() {
  return (
    <div className={styles.loading}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span className={styles.loader}></span>
        </div>
      </div>
    </div>
  );
}
