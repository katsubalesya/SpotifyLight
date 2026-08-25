import { useEffect, useState, type FC } from "react";
import { PanelLeftClose, Plus, Maximize2, Minimize2, List } from "lucide-react";

import { Button } from "../../shared/UI/Button";
import styles from "./LibrarySidebar.module.css";

// import { useAccessToken } from "../../entities/hooks/useAccessToken";
// import { useLoadPlaylist } from "../../entities/playlists/api/UseLoadPlaylist";
import { LibraryList, type ILibraryItem } from "../../entities/playlists/ui";
// import { getLibraryPlaylists } from "../../entities/playlists/api/GetLibraryPlaylists";
// import { useLoadArtists } from "../../entities/artist/api/useLoadArtists";
// import { useLoadRecentlyPlayed } from "../../entities/track/api/useLoadRecentPlayed";
import { RecentTrackList } from "../../entities/track/ui/recentTrackList";
// import { useLoadAlbums } from "../../entities/album/api/useLoadAlbums";
// import { useLoadPodcasts } from "../../entities/podcast/api/useLoadPodcasts";
import { useLibrary } from "../../entities/library/model/useLibrary";

type LibraryVariant =
  | "playlists"
  | "artists"
  | "albums"
  | "podcasts"
  | "recents";

interface ILibrarySidebarProps {
  isExpanded?: boolean;
  onResize: () => void;
}

export const LibrarySidebar: FC<ILibrarySidebarProps> = ({
  isExpanded = false,
  onResize,
}) => {
  // const token = useAccessToken();

  const [activeVariant, setActiveVariant] =
    useState<LibraryVariant>("playlists");

  // const [isRecentsOpen, setIsRecentsOpen] = useState(false);

  const {
    playlists,
    artists,
    albums,
    podcasts,
    tracks,
    isLoading,
    error,
    loadLibrary,
  } = useLibrary();

  // const libraryList = useMemo(() => {
  //   return getLibraryPlaylists(playlists);
  // }, [playlists]);

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  // const handleVariantChange = (variant: LibraryVariant) => {
  //   setActiveVariant(variant);

  //   if (variant === "artists" && artists.length === 0) {
  //     void loadArtists();
  //   }
  //   if (variant === "albums" && albums.length === 0) {
  //     void loadAlbums();
  //   }
  //   if (variant === "podcasts" && podcasts.length === 0) {
  //     void loadPodcasts();
  //   }
  // };

  const handleCreatePlayList = async () => {};

  const handleRecents = () => {
    setActiveVariant("recents");
  };

  const handleVariantChange = (variant: LibraryVariant) => {
    setActiveVariant(variant);
  };

  const renderLibraryContent = () => {
    if (isLoading) {
      return <span className={styles.loader}>Loading...</span>;
    }

    if (error) {
      return <span>{error}</span>;
    }

    switch (activeVariant) {
      case "playlists":
        return (
          <LibraryList
            items={playlists.map<ILibraryItem>((playlist) => ({
              id: playlist.id,
              type: "playlist",
              title: playlist.name,
              subtitle: `Playlist ${playlist.ownerName}`,
              imageUrl: playlist.mainImage ?? null,
              to: `/playlists/${playlist.id}`,
            }))}
            emptyMessage="No playlists"
          />
        );

      case "artists":
        return (
          <LibraryList
            items={artists.map<ILibraryItem>((artist) => ({
              id: artist.id,
              type: "artist",
              title: artist.name,
              subtitle: `Artist ${artist.name}`,
              imageUrl: artist.imageUrl ?? null,
              to: `/artists/${artist.id}`,
            }))}
            emptyMessage="No tracked performers"
          />
        );

      case "albums":
        return (
          <LibraryList
            items={albums.map<ILibraryItem>((album) => ({
              id: album.id,
              type: "album",
              title: album.name,
              subtitle: `Album ${album.artistName}`,
              imageUrl: album.imageUrl ?? null,
              to: `/albums/${album.id}`,
            }))}
            emptyMessage="No saved albums"
          />
        );

      case "podcasts":
        return (
          <LibraryList
            items={podcasts.map<ILibraryItem>((podcast) => ({
              id: podcast.id,
              type: "podcast",
              title: podcast.name,
              subtitle: `Podcast ${podcast.publisher}`,
              imageUrl: podcast.imageUrl ?? null,
              to: `/podcasts/${podcast.id}`,
            }))}
            emptyMessage="No saved podcasts"
          />
        );

      case "recents":
        return <RecentTrackList tracks={tracks} />;

      default:
        return null;
    }
  };

  // const newPlaylist = await response.json();
  // };

  // function handleSwitchSidebarSize(): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : ""}`}>
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
          <Button variant="ghost" onClick={handleCreatePlayList}>
            <Plus />
            Create
          </Button>

          <Button onClick={onResize} variant="ghost">
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        </div>
      </div>

      <div className={styles.variants}>
        <Button
          variant="ghost"
          onClick={() => handleVariantChange("playlists")}
        >
          Playlists
        </Button>

        <Button variant="ghost" onClick={() => handleVariantChange("artists")}>
          Artists
        </Button>

        <Button variant="ghost" onClick={() => handleVariantChange("albums")}>
          Albums
        </Button>

        <Button variant="ghost" onClick={() => handleVariantChange("podcasts")}>
          Podcasts
        </Button>
      </div>

      <div>
        <div>Search</div>
        <Button variant="ghost" onClick={handleRecents}>
          Recents
          <List />
        </Button>
      </div>

      <div className={styles.listContainer}>
        {
          renderLibraryContent()
          //   isLoading ? (<span className={styles.loader}>Loading...</span> ) : (
          //     <LibraryPlaylists list={libraryList} />
          // )
        }
      </div>
    </div>
  );
};
