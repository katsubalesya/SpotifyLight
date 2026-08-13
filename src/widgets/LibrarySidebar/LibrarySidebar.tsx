import { useEffect, type FC } from "react";
import { PanelLeftClose, Plus, Maximize2, Minimize2 } from "lucide-react";
import { useAccessToken } from "../../shared/hooks/UseAccessToken";
import { Button } from "../../shared/UI/Button";
import styles from "./LibrarySidebar.module.css";

const LIBRARY_URIS = ["spotify:playlist", "spotify:album", "spotify:artist"];

interface ILibrarySidebarProps {
  isExpanded?: boolean;
  onResize: () => void;
}
export const LibrarySidebar: FC<ILibrarySidebarProps> = ({
  isExpanded = false,
  onResize,
}) => {
  const token = useAccessToken();

  const loadLibraryContent = async () => {
    // const responce = await fetch(`https://api.spotify.com/v1/me/library/contains?uris=${LIBRARY_URIS.join(',')}`, {
    // const responce = await fetch(`https://api.spotify.com/v1/users/smedjan/playlists`, {
    const responce = await fetch(
      `https://api.spotify.com/v1/users/me/playlists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await responce.json();
    console.log(data);
  };

  // const handleSwitchSidebarSize = () => {
  //   onResize();
  // };

  useEffect(() => {
    // loadLibraryContent();
  }, []);

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
    </div>
  );
};
