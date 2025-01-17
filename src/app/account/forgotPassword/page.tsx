"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";
import { forgotPassword } from "@/actions/auth";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await forgotPassword(email);
      setIsSending(false);
      setIsSendEmail(true);
    } catch (error: any) {
      if (error.digest === "unregistered user") {
        setMessage("등록되지 않은 계정입니다.");
        setIsSending(false);
      } else if (error.digest) {
        setMessage(error.digest);
        setIsSending(false);
      } else {
        setMessage("문제가 발생했습니다. 다시 시도하세요.");
        setIsSending(false);
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
        <div className={styles.buttonDiv}>
          <button
            type="submit"
            className={`${
              isSendEmail || isSending ? styles.disabledButton : styles.button
            }`}
            disabled={isSendEmail || isSending}
          >
            {isSending ? "전송 중..." : "비밀번호 찾기"}
          </button>
          {message && <span className={styles.message}>{message}</span>}
        </div>
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
