"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function Shop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.shop}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>Shop</span>
        </div>
        <div className={styles.center}></div>
      </div>
    </div>
  );
}
