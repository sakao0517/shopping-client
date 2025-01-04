"use client";

import { deleteUser } from "@/actions/auth";
import styles from "./DeleteButton.module.css";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

export default function DeleteButton() {
  const deleteUserMutate = useMutation({
    mutationFn: async () => {
      await deleteUser();
    },
    onSuccess: () => {
      signOut({ redirectTo: "/" });
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });
  const handleLogout = async () => {
    const check = confirm("정말로 탈퇴하시겠습니까?");
    if (check) deleteUserMutate.mutate();
  };
  return (
    <div className={styles.deleteButton}>
      <span onClick={handleLogout}>회원탈퇴</span>
    </div>
  );
}
