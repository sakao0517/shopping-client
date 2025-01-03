"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const signupMutate = useMutation({
    mutationFn: async () => {
      await signup(name, email, password, phone);
    },
    onSuccess: () => {
      router.push("/account/signup/complete");
    },
    onError: (error: any) => {
      if (error.digest === "registered user") {
        setMessage("이미 가입된 계정입니다.");
      } else if (error.digest) {
        setMessage(error.digest);
      } else {
        setMessage("문제가 발생했습니다. 다시 시도하세요.");
      }
    },
  });
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupMutate.mutate();
  };
  return (
    <div className={styles.signup}>
      <form className={styles.main} onSubmit={handleSubmit}>
        <div className={styles.info}>
          <span>Create Account</span>
        </div>
        <div className={styles.inputSection}>
          <input
            required
            maxLength={20}
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
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
            maxLength={20}
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
          <input
            required
            maxLength={11}
            placeholder="Phone"
            value={phone}
            onChange={(e) => {
              const value = e.target.value
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*)\./g, "$1");
              setPhone(value);
            }}
          />
        </div>
        <div className={styles.buttonDiv}>
          <button type="submit" className={styles.button}>
            회원가입
          </button>
          {message && <span className={styles.message}>{message}</span>}
        </div>
        <div className={styles.menu}>
          <Link href={"/account/login"}>로그인</Link>
        </div>
      </form>
    </div>
  );
}
