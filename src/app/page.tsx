import { getHomeWallpaper } from "@/actions/home";
import styles from "./page.module.css";
import HomeWallpaper from "./_components/HomeWallpaper/HomeWallpaper";

export default async function Home() {
  const homeWallpaper = await getHomeWallpaper();
  return (
    <div className={styles.home}>
      <HomeWallpaper homeWallpaper={homeWallpaper} />
    </div>
  );
}
