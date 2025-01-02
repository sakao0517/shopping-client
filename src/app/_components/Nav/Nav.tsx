"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavStore, useSearchStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { UserType } from "@/type/type";
import { getUserInfo } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Nav() {
  const [width, setWidth] = useState<number | undefined>();
  const { data: session } = useSession();
  const { data: userInfo } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const { setNavOn } = useNavStore();
  const { setSearchOn } = useSearchStore();
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={styles.nav}>
      <div className={styles.main}>
        <div className={styles.leftMenu}>
          {width !== undefined ? (
            width > 767 ? (
              <Link href={"/"}>브랜드이름</Link>
            ) : (
              <span
                onClick={() => {
                  setNavOn(true);
                }}
              >
                <AiOutlineMenu size={24} color="black" />
              </span>
            )
          ) : (
            <></>
          )}
        </div>
        <div className={styles.rightMenu}>
          <Link href={"/collections/new?page=1"}>SHOP</Link>
          <span
            onClick={() => {
              setSearchOn(true);
            }}
          >
            SEARCH
          </span>
          {session?.user?.email ? (
            <Link href={"/account"}>ACCOUNT</Link>
          ) : (
            <Link href={"/account/login"}>LOGIN</Link>
          )}
          <Link href={"/cart"}>{`CART(${
            userInfo ? userInfo.cart.length : "0"
          })`}</Link>
        </div>
      </div>
    </div>
  );
}
