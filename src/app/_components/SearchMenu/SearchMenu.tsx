"use client";

import { useNavStore, useSearchStore } from "@/store/store";
import styles from "./SearchMenu.module.css";
import { BsXLg } from "react-icons/bs";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchMenu() {
  const { setNavOn } = useNavStore();
  const { searchOn, setSearchOn } = useSearchStore();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${search}`);
    setSearchOn(false);
    setNavOn(false);
    setSearch("");
  };
  useEffect(() => {
    if (searchOn) {
      const body: HTMLBodyElement =
        window.document.getElementsByTagName("body")[0];
      body.style.overflowY = "hidden";
    } else {
      const body: HTMLBodyElement =
        window.document.getElementsByTagName("body")[0];
      body.style.overflowY = "auto";
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
          <BsXLg size={24} color="black" />
        </span>
      </div>
      <div className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.searchBar}>
          <input
            required
            value={search || ""}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button type="submit">SEARCH</button>
        </form>
      </div>
    </div>
  );
}
