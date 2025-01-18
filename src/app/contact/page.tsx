import styles from "./page.module.css";

export default function Contact() {
  return (
    <div className={styles.contact}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>Contact</span>
        </div>
        <div className={styles.center}>
          <p>
            안녕하세요 :{")"} help.starspray@gmail.com으로 이메일을 통해
            문의주세요.
          </p>
          {/* 브랜드 이메일 입력 */}
          <br />
          <p>
            고객 서비스 팀은 월요일부터 금요일 오전 10시부터 오후 2시까지
            근무하며, 최대한 빨리 답변해 드리겠습니다.
          </p>
          <br />
          <p>좋은 하루 보내세요.</p>
        </div>
      </div>
    </div>
  );
}
