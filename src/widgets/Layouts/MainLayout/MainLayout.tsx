import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../../Header/Header";
import { LibrarySidebar } from "../../LibrarySidebar/LibrarySidebar";
import { PlayerSidebar } from "../../PlayerSidebar/PlayerSidebar";
import { Player } from "../../Player/Player";
import styles from "./MainLayout.module.css";

// export const MainLayout: FC<PropsWithChildren> = ({children}) => {
export const MainLayout = () => {
  const [isLibrarySidebarExpanded, setIsLibrarySidebarExpanded] =
    useState(false);

  const handleSidebarResize = () => {
    setIsLibrarySidebarExpanded((prev) => !prev);
  };

  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.body}>
        <div className={styles.content}>
          {/* Library + Main */}
          <div
            className={`${styles.library} ${isLibrarySidebarExpanded ? styles.libraryEexpanded : ""}`}
          >
            <LibrarySidebar
              isExpanded={isLibrarySidebarExpanded}
              onResize={handleSidebarResize}
            />
          </div>
          <main
            className={`${styles.main} ${isLibrarySidebarExpanded ? styles.mainCollapsed : ""}`}
          >
            <Outlet />
          </main>
        </div>

        <div className={styles.playerSidebar}>
          <PlayerSidebar />
        </div>
      </div>

      <Player />
    </div>
  );
};
