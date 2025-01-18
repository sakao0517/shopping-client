/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import styles from "./HomeWallpaper.module.css";
import { HomeWallpaperType } from "@/type/type";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomeWallpaper({
  homeWallpaper,
}: {
  homeWallpaper: HomeWallpaperType;
}) {
  const [width, setWidth] = useState<number | undefined>();
  const router = useRouter();
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
      <video
        className={styles.video}
        src={
          "https://res.cloudinary.com/hoyahoya/video/upload/v1708061295/letter/video22_vhm7v7.mp4"
        }
        autoPlay
        muted
        loop
        playsInline
      />
      {width && (
        <motion.div
          initial={{
            transform: `translate(-50%, -50%) scale(${width > 767 ? 3.5 : 2})`,
          }}
          animate={{ transform: "translate(-50%, -50%) scale(0)" }}
          transition={{ duration: 5, ease: "easeIn", delay: 0.3 }}
          className={styles.starspray}
        >
          <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1708402276/letter/%EC%9D%B4%EC%B9%B4%EB%A6%AC%EC%8B%A0%EC%A7%80%EB%A8%B8%EA%B7%B8%EC%BB%B5/cup_1_uup0zo.png" />
        </motion.div>
      )}
    </>
  );
  // return (
  //   <>
  //     {width !== undefined ? (
  //       width > 767 ? (
  //         <img className={styles.img} src={homeWallpaper.pc} />
  //       ) : (
  //         <img className={styles.img} src={homeWallpaper.mobile} />
  //       )
  //     ) : (
  //       <></>
  //     )}
  //   </>
  // );
}
