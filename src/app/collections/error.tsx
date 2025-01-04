"use client";

import Link from "next/link";
import styles from "./error.module.css";

export default function Error() {
  return (
    <div className={styles.error}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>현재 판매중인 상품이 아닙니다.</span>
        </div>
        <div className={styles.center}>
          <p>
            {"주소를 다시 확인해주세요. "}
            <Link href={"/"}>메인 페이지로 가기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
