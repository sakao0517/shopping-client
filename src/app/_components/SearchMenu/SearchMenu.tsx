"use client";

import { useNavStore, useSearchStore } from "@/store/store";
import styles from "./SearchMenu.module.css";
import { BsXLg } from "react-icons/bs";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mainColor } from "@/app/_config/ColorSetting";

export default function SearchMenu() {
  const { setNavOn } = useNavStore();
  const { searchOn, setSearchOn } = useSearchStore();
  const [search, setSearch] = useState("");
  const [scrollY, setScrollY] = useState<number>(0);

  const router = useRouter();
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${search}`);
    setSearchOn(false);
    setNavOn(false);
    setSearch("");
  };
  useEffect(() => {
    const body: HTMLBodyElement =
      window.document.getElementsByTagName("body")[0];
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos =
      userAgent.indexOf("iphone") > -1 ||
      (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
    if (searchOn) {
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
  }, [searchOn]);
  return (
    <div className={searchOn ? `${styles.searchOn}` : `${styles.searchOff}`}>
      <div className={styles.top}>
        <span
          onClick={() => {
            setSearchOn(false);
          }}
        >
          <BsXLg size={24} color={`${mainColor}`} />
        </span>
      </div>
      <div className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.searchBar}>
          <div className={styles.searchBarInput}>
            <input
              required
              value={search || ""}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className={styles.searchBarButton}>
            <button type="submit">SEARCH</button>
          </div>
        </form>
      </div>
    </div>
  );
}
