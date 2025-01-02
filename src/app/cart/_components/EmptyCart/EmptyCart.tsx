"use client";

import Link from "next/link";
import styles from "./EmptyCart.module.css";

export default function EmptyCart() {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>장바구니에 담은 상품이 없습니다.</span>
        </div>
        <div className={styles.center}>
          <p>
            <Link href={"/"}>메인 페이지로 가기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
