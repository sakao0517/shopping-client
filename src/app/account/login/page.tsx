"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (user?.error) {
      setMessage(
        "이메일 또는 비밀번호를 잘못 입력하셨습니다. (비밀번호는 6자 이상 20자 이하)"
      );
    } else {
      router.push("/account");
      router.refresh();
    }
  };
  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit} className={styles.main}>
        <div className={styles.info}>
          <span>Login</span>
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
          />
          <input
            required
            placeholder="Password"
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => {
              const filteredValue = e.target.value.replace(
                /[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g,
                ""
              );
              setPassword(filteredValue);
            }}
          />
        </div>
        <div className={styles.buttonDiv}>
          <button type="submit" className={styles.button}>
            로그인
          </button>
          {message && <span className={styles.message}>{message}</span>}
        </div>
        <div className={styles.menu}>
          <Link href={"/account/forgotPassword"}>비밀번호 찾기</Link>
          <Link href={"/account/signup"}>회원가입</Link>
        </div>
      </form>
    </div>
  );
}
