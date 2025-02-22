"use client";

import styles from "./Loading.module.css";

export default function Loading() {
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
