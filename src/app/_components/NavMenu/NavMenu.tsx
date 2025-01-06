"use client";

import { useEffect, useState } from "react";
import styles from "./NavMenu.module.css";
import { useNavStore, useSearchStore } from "@/store/store";
import { BsXLg } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LogoutButton from "./_components/LogoutButton/LogoutButton";
import { useQuery } from "@tanstack/react-query";
import { CategoryType } from "@/type/type";
import { getCategory } from "@/actions/category";
import { AnimatePresence, motion } from "motion/react";
import { mainColor } from "@/app/_config/ColorSetting";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock-upgrade";

export default function NavMenu() {
  const { data: categoryData } = useQuery<CategoryType>({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });
  const router = useRouter();
  const { data: session } = useSession();
  const { navOn, setNavOn } = useNavStore();
  const { setSearchOn } = useSearchStore();
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState(pathname);

  useEffect(() => {
    if (navOn) {
      const body: HTMLBodyElement =
        window.document.getElementsByTagName("body")[0];
      // body.style.overflowY = "hidden";
      disableBodyScroll(body);
    } else {
      const body: HTMLBodyElement =
        window.document.getElementsByTagName("body")[0];
      // body.style.overflowY = "auto";
      enableBodyScroll(body);
    }
  }, [navOn]);
  useEffect(() => {
    if (currentPathname !== pathname) {
      setCurrentPathname(pathname);
      setNavOn(false);
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return (
    <AnimatePresence>
      {navOn && (
        <motion.div
          className={styles.navOn}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.top}>
            <span
              onClick={() => {
                setNavOn(false);
              }}
            >
              <BsXLg size={24} color={`${mainColor}`} />
            </span>
          </div>
          <div className={styles.main}>
            <div className={styles.brand}>
              <span
                onClick={() => {
                  if (pathname === `/`) {
                    return setNavOn(false);
                  }
                  router.push(`/`);
                }}
              >
                브랜드이름
              </span>
            </div>
            {categoryData &&
              categoryData.category.map((category, index) => (
                <div className={styles.menu} key={index}>
                  <span
                    onClick={() => {
                      if (pathname === `/collections/${category}`) {
                        return setNavOn(false);
                      }
                      router.push(`/collections/${category}?page=1`);
                    }}
                  >
                    {category}
                  </span>
                </div>
              ))}
            <div className={styles.search}>
              <span
                onClick={() => {
                  setSearchOn(true);
                }}
              >
                Search
              </span>
            </div>
            {session?.user?.email ? (
              <>
                <div className={styles.account}>
                  <span
                    onClick={() => {
                      if (pathname === "/account") {
                        return setNavOn(false);
                      }
                      router.push("/account");
                    }}
                  >
                    Account
                  </span>
                </div>
                <LogoutButton />
              </>
            ) : (
              <>
                <div className={styles.account}>
                  <span
                    onClick={() => {
                      if (pathname === "/account/login") {
                        return setNavOn(false);
                      }
                      router.push("/account/login");
                    }}
                  >
                    Login
                  </span>
                </div>
                <div className={styles.menu}>
                  <span
                    onClick={() => {
                      if (pathname === "/account/signup") {
                        return setNavOn(false);
                      }
                      router.push("/account/signup");
                    }}
                  >
                    Register
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
