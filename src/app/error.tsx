"use client";

import styles from "./error.module.css";

export default function Error() {
  console.log("hi");
  console.log(process.env.SERVER_URL);
  console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  return (
    <div className={styles.notFound}>
      <div className={styles.main}>
        <span>오류가 발생했습니다.</span>
        <div className={styles.goHome}>
          <p>주소를 다시 확인해주세요.</p>
        </div>
      </div>
    </div>
  );
}
