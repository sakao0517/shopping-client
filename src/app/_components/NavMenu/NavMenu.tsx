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
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const body: HTMLBodyElement =
      window.document.getElementsByTagName("body")[0];
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos =
      userAgent.indexOf("iphone") > -1 ||
      (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
    if (navOn) {
      if (isIos) {
        const tmpScrollY = window.scrollY;
        setScrollY(tmpScrollY);
        body.style.position = "fixed";
        body.style.top = `-${tmpScrollY}px`;
      } else {
        body.style.overflow = "hidden";
      }
    } else {
      if (isIos) {
        body.style.removeProperty("position");
        body.style.removeProperty("top");
        window.scrollTo(0, scrollY);
      } else {
        body.style.removeProperty("overflow");
      }
    }
  }, [navOn]);
  useEffect(() => {
    if (currentPathname !== pathname) {
      setCurrentPathname(pathname);
      setScrollY(0);
      setNavOn(false);
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
                STAR SPRAY {/* 브랜드 이름 */}
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
