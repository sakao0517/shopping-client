"use client";

import styles from "./HomeWallpaper.module.css";
import { HomeWallpaperType } from "@/type/type";
import { useEffect, useState } from "react";

export default function HomeWallpaper({
  homeWallpaper,
}: {
  homeWallpaper: HomeWallpaperType;
}) {
  const [width, setWidth] = useState<number | undefined>();
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {width !== undefined ? (
        width > 767 ? (
          <img className={styles.img} src={homeWallpaper.pc} />
        ) : (
          <img className={styles.img} src={homeWallpaper.mobile} />
        )
      ) : (
        <></>
      )}
    </>
  );
}
