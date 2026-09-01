import { useEffect, useMemo, useState, type FC } from "react";
import { PanelLeftClose, Plus, Maximize2, Minimize2, List } from "lucide-react";

import { Button } from "../../shared/UI/Button";
import { Search } from "../../shared/UI/Search";
import styles from "./LibrarySidebar.module.css";

import { LibraryList, type LibraryItem } from "./ui";
import { RecentTrackList } from "../../entities/track/ui/recentTrackList";
import { useLibrary } from "../../features/library/model/useLibrary";

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

const includesSearchQuery = (
  query: string,
  ...values: Array<string | null | undefined>
) => {
  if (!query) {
    return true;
  }

  return values.some((value) => value?.toLocaleLowerCase().includes(query));
};

export const LibrarySidebar: FC<LibrarySidebarProps> = ({
  isExpanded = false,
  onResize,
}) => {
  const [activeVariant, setActiveVariant] =
    useState<LibraryVariant>("playlists");

  const [isCreating, setIsCreating] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState("");

  const {
    playlists,
    artists,
    albums,
    podcasts,
    tracks,
    isLoading,
    error,
    sectionErrors,
    loadLibrary,
    createPlaylist,
  } = useLibrary();

  const normalizedQuery = libraryQuery.trim().toLocaleLowerCase();

  const filteredLibrary = useMemo(
    () => ({
      playlists: playlists.filter((item) =>
        includesSearchQuery(normalizedQuery, item.name, item.ownerName),
      ),
      artists: artists.filter((item) =>
        includesSearchQuery(normalizedQuery, item.name),
      ),
      albums: albums.filter((item) =>
        includesSearchQuery(normalizedQuery, item.name, item.artistName),
      ),
      podcasts: podcasts.filter((item) =>
        includesSearchQuery(normalizedQuery, item.name),
      ),
      tracks: tracks.filter((item) =>
        includesSearchQuery(
          normalizedQuery,
          item.name,
          item.artistName,
          item.albumName,
        ),
      ),
    }),
    [playlists, artists, albums, podcasts, tracks, normalizedQuery],
  );

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

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
        error instanceof Error ? error.message : "Failed to create playlist";

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
      return <span>Loading...</span>;
    }

    if (error) {
      return <span>{error}</span>;
    }

    const sectionError =
      activeVariant === "recents"
        ? sectionErrors.tracks
        : sectionErrors[activeVariant];

    if (sectionError) {
      return <span>{sectionError}</span>;
    }

    switch (activeVariant) {
      case "playlists":
        return (
          <LibraryList
            items={filteredLibrary.playlists.map<LibraryItem>((playlist) => ({
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
            items={filteredLibrary.artists.map<LibraryItem>((artist) => ({
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
            items={filteredLibrary.albums.map<LibraryItem>((album) => ({
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
            items={filteredLibrary.podcasts.map<LibraryItem>((podcast) => ({
              id: podcast.id,
              type: "podcast",
              title: podcast.name,
              subtitle: `Podcast ${podcast.name}`,
              imageUrl: podcast.imageUrl ?? null,
              to: `/podcasts/${podcast.id}`,
            }))}
            emptyMessage="No saved podcasts"
          />
        );

      case "recents":
        return <RecentTrackList tracks={filteredLibrary.tracks} />;

      default:
        return null;
    }
  };

  return (
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
          <Button
            variant="ghost"
            onClick={handleCreatePlaylist}
            disabled={isCreating}
          >
            <Plus size={18} />
            Create
          </Button>

          <Button onClick={onResize} variant="ghost">
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        </div>
      </div>

      <div>
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

        <Button
          variant={activeVariant === "albums" ? "secondary" : "ghost"}
          onClick={() => handleVariantChange("albums")}
        >
          Albums
        </Button>

        <Button
          variant={activeVariant === "podcasts" ? "secondary" : "ghost"}
          onClick={() => handleVariantChange("podcasts")}
        >
          Podcasts
        </Button>
      </div>

      <div className={styles.libraryTools}>
        <Search
          value={libraryQuery}
          onChange={setLibraryQuery}
          placeholder="Search in Your Library"
          ariaLabel="Search in Your Library"
          variant="library"
        />
        <Button variant="ghost" onClick={handleRecents}>
          Recents
          <List />
        </Button>
      </div>

      <div className={styles.listContainer}>{renderLibraryContent()}</div>
    </div>
  );
};
