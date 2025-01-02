"use client";

import { serverLogout } from "@/actions/auth";
import styles from "./LogoutButton.module.css";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await serverLogout();
    signOut({ redirectTo: "/" });
  };
  return (
    <div className={styles.logoutButton}>
      <span onClick={handleLogout}>Logout</span>
    </div>
  );
}
