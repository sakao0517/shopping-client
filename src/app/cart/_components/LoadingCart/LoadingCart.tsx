"use client";

import styles from "./LoadingCart.module.css";

export default function LoadingCart() {
  return (
    <div className={styles.loadingCart}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>장바구니를 불러오고있습니다.</span>
        </div>
      </div>
    </div>
  );
}
