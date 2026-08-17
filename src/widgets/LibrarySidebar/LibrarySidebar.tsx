import { useEffect, useMemo, type FC } from "react";
import { PanelLeftClose, Plus, Maximize2, Minimize2 } from "lucide-react";
// import { useAccessToken } from "../../shared/hooks/UseAccessToken";
import { Button } from "../../shared/UI/Button";
import styles from "./LibrarySidebar.module.css";
import { useLoadPlaylist } from "../../shared/API/UseLoadPlayList";
import { LibraryPlaylists } from "../../shared/LibraryPlaylists";
import { getLibraryPlaylists } from "../../shared/utils/GetLibraryPlaylists";

const LIBRARY_URIS = ["spotify:playlist", "spotify:album", "spotify:artist"];

interface ILibrarySidebarProps {
  isExpanded?: boolean;
  onResize: () => void;
}
export const LibrarySidebar: FC<ILibrarySidebarProps> = ({
  isExpanded = false,
  onResize,
}) => {
  const { load, isLoading, playlists } = useLoadPlaylist();

  const libraryList = useMemo(() => {
    return getLibraryPlaylists(playlists)
  }, [playlists])


  // const handleSwitchSidebarSize = () => {
  //   onResize();
  // };

  useEffect(() => {
    void load();
  }, [load]);

  // function handleSwitchSidebarSize(): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    // <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <PanelLeftClose
            className={styles.closeIcon}
            size={18}
            color="var(--text-subdued)"
          />
          <span>Your Library</span>
        </div>
        <div className={styles.headerRight}>

          <Button variant="ghost">
            <Plus />
            Create
          </Button>

          <Button onClick={onResize} variant="ghost">
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        </div>
      </div>
      <div className={styles.listContainer}>
        {
          isLoading ? (<span className={styles.loader}>Loading...</span> ) : (
            <LibraryPlaylists list={libraryList} />
        )}
      </div>
    </div>
  );
};
