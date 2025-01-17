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
  const [isUpdate, setIsUpdate] = useState(false);
  const [timeOut, setTimeOut] = useState<any>();
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
      clearTimeout(timeOut);
      queryClient.invalidateQueries({ queryKey: ["admin", "home"] });
      setIsUpdate(true);
      setTimeOut(
        setTimeout(() => {
          setIsUpdate(false);
        }, 500)
      );
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });
  return (
    <div className={styles.home}>
      <div className={`${styles.main} ${isUpdate ? styles.isUpdate : ""}`}>
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
          <div className={`${styles.input} ${styles.pcInput}`}>
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
              className={styles.bottomButton}
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
