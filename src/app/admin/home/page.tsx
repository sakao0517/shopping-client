"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./page.module.css";
import { getHomeWallpaper, updateHomeWallpaper } from "@/actions/home";
import { HomeWallpaperType } from "@/type/type";
import { useEffect, useState } from "react";

export default function Home() {
  const queryClient = useQueryClient();
  const { data: wallpaper } = useQuery<HomeWallpaperType>({
    queryKey: ["admin", "home"],
    queryFn: () => getHomeWallpaper(),
  });
  const [pc, setPc] = useState("");
  const [mobile, setMobile] = useState("");
  useEffect(() => {
    if (!wallpaper) return;
    setPc(wallpaper?.pc);
    setMobile(wallpaper?.mobile);
  }, [wallpaper]);
  const updateMutate = useMutation({
    mutationFn: async () => {
      if (!wallpaper) return;
      await updateHomeWallpaper(wallpaper.id, pc, mobile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "home"] });
    },
  });
  return (
    <div className={styles.home}>
      <div className={styles.main}>
        <div className={styles.mainMenu}>
          <p>PC 메인페이지 설정</p>
          {wallpaper && (
            <div className={styles.pcImg}>
              {pc ? (
                <img src={pc} />
              ) : (
                <span className={styles.error}>
                  메인페이지 설정이 필요합니다.
                </span>
              )}
            </div>
          )}
          <div className={styles.input}>
            <input
              value={pc}
              onChange={(e) => {
                setPc(e.target.value);
              }}
            />
            <button
              onClick={() => {
                updateMutate.mutate();
              }}
            >
              메인페이지 변경
            </button>
          </div>
        </div>
        <div className={styles.mainMenu}>
          <p>MOBILE 메인페이지 설정</p>
          {wallpaper && (
            <div className={styles.mobileImg}>
              {mobile ? <img src={mobile} /> : <span></span>}
            </div>
          )}
          <div className={styles.input}>
            <input
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
              }}
            />
            <button
              onClick={() => {
                updateMutate.mutate();
              }}
            >
              메인페이지 변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
