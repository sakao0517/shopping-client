"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";
import { forgotPassword } from "@/actions/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSendEmail, setIsSendEmail] = useState(false);
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSendEmail(true);
    } catch (error: any) {
      if (error.message === "unregistered user") {
        alert("등록되지 않은 계정입니다.");
      } else if (error.message) {
        alert(error.message);
      } else {
        alert("문제가 발생했습니다. 다시 시도하세요.");
      }
    }
  };
  return (
    <div className={styles.forgotPassword}>
      <form onSubmit={handleSubmit} className={styles.main}>
        <div className={styles.info}>
          <span>비밀번호 재설정을 위해 이메일을 보내드리겠습니다.</span>
        </div>
        <div className={styles.inputSection}>
          <input
            required
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={isSendEmail}
          />
        </div>
        <button
          type="submit"
          className={
            isSendEmail ? `${styles.disabledButton}` : `${styles.button}`
          }
          disabled={isSendEmail}
        >
          비밀번호 찾기
        </button>
        <div className={styles.menu}>
          <Link href={"/account/login"}>로그인</Link>
        </div>
        {isSendEmail && (
          <div className={styles.success}>
            <span>이메일로 비밀번호 재설정 메일을 전송했습니다.</span>
          </div>
        )}
      </form>
    </div>
  );
}
