import Link from "next/link";
import styles from "./page.module.css";

export default function Fail() {
  return (
    <div className={styles.fail}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>주문에 문제가 발생했습니다.</span>
        </div>
        <div className={styles.goOrder}>
          <p>
            {"다시 시도해주세요. "}
            <Link href={"/"}>메인 페이지로 가기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
