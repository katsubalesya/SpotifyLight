import { Outlet } from "react-router-dom";

import { Header } from "../../Header/Header";
import { LibrarySidebar } from "../../LibrarySidebar/LibrarySidebar";
import { PlayerSidebar } from "../../PlayerSidebar/PlayerSidebar";

import { Player } from "../../Player/Player";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <LibrarySidebar /> </div>

        <main className={styles.main}>
          <Outlet />
        </main>

        <div className={styles.body}>
        <PlayerSidebar /> </div>


      <Player />
    </div>
  );
};
