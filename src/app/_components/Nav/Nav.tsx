"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import { AiOutlineMenu } from "react-icons/ai";
import {
  useCartIsChangeStore,
  useNavStore,
  useSearchStore,
} from "@/store/store";
import { useSession } from "next-auth/react";
import { UserType } from "@/type/type";
import { getUserInfo } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { mainColor } from "@/app/_config/ColorSetting";
import { BsFillHeartFill } from "react-icons/bs";
import { motion, useAnimate } from "motion/react";

export default function Nav() {
  const [width, setWidth] = useState<number | undefined>();
  const { data: session } = useSession();
  const { data: userInfo } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const [scope, animate] = useAnimate();
  const { setNavOn } = useNavStore();
  const { setSearchOn } = useSearchStore();
  const { cartIsChange, setCartIsChange } = useCartIsChangeStore();
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const heartAnimation = async () => {
      await animate(scope.current, { opacity: 1, y: 0 }, { duration: 1 });
      await animate(scope.current, { opacity: 0 }, { duration: 0.8 });
      await animate(scope.current, { y: -150 }, { duration: 0 });
    };
    if (cartIsChange) {
      setCartIsChange(false);
      heartAnimation();
    }
  }, [cartIsChange]);
  return (
    <div className={styles.nav}>
      <div className={styles.main}>
        <div className={styles.leftMenu}>
          {width !== undefined ? (
            width > 767 ? (
              <Link href={"/"}>STAR SPRAY</Link> // 브랜드 이름
            ) : (
              <span
                onClick={() => {
                  setNavOn(true);
                }}
              >
                <AiOutlineMenu size={24} color={`${mainColor}`} />
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
          <div className={styles.cart}>
            <Link href={"/cart"}>{`CART(${
              userInfo ? userInfo.cart.length : "0"
            })`}</Link>
            <motion.span
              ref={scope}
              className={styles.heart}
              initial={{ opacity: 0, y: -150 }}
            >
              <BsFillHeartFill color="red" />
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
