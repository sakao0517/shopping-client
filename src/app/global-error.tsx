"use client";

import styles from "./global-error.module.css";

export default function GlobalError() {
  return (
    <html>
      <body>
        <div className={styles.notFound}>
          <div className={styles.main}>
            <span>오류가 발생했습니다.</span>
            <div className={styles.goHome}>
              <p>주소를 다시 확인해주세요.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
