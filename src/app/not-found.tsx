"use client";

import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>페이지를 찾을 수 없습니다.</span>
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
