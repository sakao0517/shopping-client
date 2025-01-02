import Link from "next/link";
import styles from "./page.module.css";

export default function SignupComplete() {
  return (
    <div className={styles.signup}>
      <form className={styles.main}>
        <div className={styles.inputSection}>
          <span>축하합니다! 회원가입을 성공했습니다.</span>
        </div>
        <div className={styles.menu}>
          <Link href={"/account/login"}>로그인</Link>
        </div>
      </form>
    </div>
  );
}
