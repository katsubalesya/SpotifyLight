import { useEffect, useState, type FC } from "react";
import { PanelLeftClose, Plus, Maximize2, Minimize2, List } from "lucide-react";

import { Button } from "../../shared/UI/Button";
import styles from "./LibrarySidebar.module.css";

import { LibraryList, type LibraryItem } from "../../entities/playlists/ui";
import { RecentTrackList } from "../../entities/track/ui/recentTrackList";
import { useLibrary } from "../../entities/library/model/useLibrary";

type LibraryVariant =
  | "playlists"
  | "artists"
  | "albums"
  | "podcasts"
  | "recents";

interface LibrarySidebarProps {
  isExpanded?: boolean;
  onResize: () => void;
}

export const LibrarySidebar: FC<LibrarySidebarProps> = ({
  isExpanded = false,
  onResize,
}) => {
  // const token = useAccessToken();

  const [activeVariant, setActiveVariant] =
    useState<LibraryVariant>("playlists");

  // const [isRecentsOpen, setIsRecentsOpen] = useState(false);
const [isCreating, setIsCreating] = useState(false);

  const {
    playlists,
    artists,
    albums,
    podcasts,
    tracks,
    isLoading,
    error,
    loadLibrary,
    createPlaylist,
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

const handleCreatePlaylist = async () => {
  const enteredName = window.prompt("Enter playlist name");

  if (enteredName === null) {
    return;
  }

  const playlistName = enteredName.trim();

  if (!playlistName) {
    window.alert("Playlist name cannot be empty");
    return;
  }

  try {
    setIsCreating(true);

    await createPlaylist(playlistName);

    setActiveVariant("playlists");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create playlist";

    window.alert(message);
  } finally {
    setIsCreating(false);
  }
};

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
            items={playlists.map<LibraryItem>((playlist) => ({
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
            items={artists.map<LibraryItem>((artist) => ({
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
            items={albums.map<LibraryItem>((album) => ({
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
            items={podcasts.map<LibraryItem>((podcast) => ({
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
          <Button variant="ghost" onClick={handleCreatePlaylist} disabled={isCreating}>
            <Plus size={18}/>
            Create
          </Button>

          <Button onClick={onResize} variant="ghost">
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        </div>
      </div>

      <div className={styles.variants}>
        <Button
          variant={activeVariant === "playlists" ? "secondary" : "ghost"}
          onClick={() => handleVariantChange("playlists")}
        >
          Playlists
        </Button>

        <Button
          variant={activeVariant === "artists" ? "secondary" : "ghost"}
          onClick={() => setActiveVariant("artists")}
        >
          Artists
        </Button>

        <Button variant={activeVariant === "albums" ? "secondary" : "ghost"} onClick={() => handleVariantChange("albums")}>
          Albums
        </Button>

        <Button variant={activeVariant === "podcasts" ? "secondary" : "ghost"} onClick={() => handleVariantChange("podcasts")}>
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
