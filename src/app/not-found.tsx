"use client";

import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.main}>
        <span>404 Page Not Found</span>
        <div className={styles.goHome}>
          <p>
            {"주소를 다시 확인해주세요. "}
            <Link href={"/"}>메인 페이지로 가기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
