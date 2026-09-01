import { Link, useSearchParams } from "react-router-dom";
import type {
  SpotifySearchAlbum,
  SpotifySearchArtist,
  SpotifySearchPlaylist,
  SpotifySearchResponse,
  SpotifySearchShow,
  SpotifySearchTrack,
} from "../../features/search/api/types";
import { useEffect, useState } from "react";
import { searchSpotify } from "../../features/search/index";
import styles from "./SearchPage.module.css";

const removeEmptyItems = <T,>(items: Array<T | null> | undefined): T[] => {
  return items?.filter((item): item is T => item !== null) ?? [];
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [results, setResults] = useState<SpotifySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults(null);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const loadResults = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await searchSpotify(query, controller.signal);

        if (!controller.signal.aborted) {
          setResults(data);
        }
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Search failed",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadResults();

    return () => {
      controller.abort();
    };
  }, [query]);

  if (!query) {
    return (
      <section className={styles.page}>
        <h1>Search</h1>
        <p>Enter an artist, track, album, playlist or podcast.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className={styles.page}>
        <h1>Search results for “{query}”</h1>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.page}>
        <h1>Search results for “{query}”</h1>
        <p className={styles.error}>{error}</p>
      </section>
    );
  }

  const tracks = removeEmptyItems<SpotifySearchTrack>(results?.tracks?.items);

  const artists = removeEmptyItems<SpotifySearchArtist>(
    results?.artists?.items,
  );

  const albums = removeEmptyItems<SpotifySearchAlbum>(results?.albums?.items);

  const playlists = removeEmptyItems<SpotifySearchPlaylist>(
    results?.playlists?.items,
  );

  const shows = removeEmptyItems<SpotifySearchShow>(results?.shows?.items);

  const hasResults =
    tracks.length > 0 ||
    artists.length > 0 ||
    albums.length > 0 ||
    playlists.length > 0 ||
    shows.length > 0;

  return (
    <section className={styles.page}>
      <h1>Search results for “{query}”</h1>

      {!hasResults && <p>Nothing found.</p>}

      {tracks.length > 0 && (
        <ResultSection title="Tracks">
          {tracks.map((track) => (
            <SearchResultCard
              key={track.id}
              title={track.name}
              subtitle={`${track.artists.map((artist) => artist.name).join(", ")} · ${track.album.name}`}
              imageUrl={track.album.images[0]?.url}
              externalUrl={track.external_urls.spotify}
            />
          ))}
        </ResultSection>
      )}

      {artists.length > 0 && (
        <ResultSection title="Artists">
          {artists.map((artist) => (
            <SearchResultCard
              key={artist.id}
              title={artist.name}
              subtitle="Artist"
              imageUrl={artist.images[0]?.url}
              to={`/artists/${artist.id}`}
            />
          ))}
        </ResultSection>
      )}

      {albums.length > 0 && (
        <ResultSection title="Albums">
          {albums.map((album) => (
            <SearchResultCard
              key={album.id}
              title={album.name}
              subtitle={album.artists.map((artist) => artist.name).join(", ")}
              imageUrl={album.images[0]?.url}
              to={`/albums/${album.id}`}
            />
          ))}
        </ResultSection>
      )}

      {playlists.length > 0 && (
        <ResultSection title="Playlists">
          {playlists.map((playlist) => (
            <SearchResultCard
              key={playlist.id}
              title={playlist.name}
              subtitle={
                playlist.owner?.display_name
                  ? `Playlist · ${playlist.owner.display_name}`
                  : "Playlist"
              }
              imageUrl={playlist.images?.[0]?.url}
              to={`/playlists/${playlist.id}`}
            />
          ))}
        </ResultSection>
      )}

      {shows.length > 0 && (
        <ResultSection title="Podcasts">
          {shows.map((show) => (
            <SearchResultCard
              key={show.id}
              title={show.name}
              subtitle={show.name ?? "Podcast"}
              imageUrl={show.images[0]?.url}
              to={`/podcasts/${show.id}`}
            />
          ))}
        </ResultSection>
      )}
    </section>
  );
};

interface ResultSectionProps {
  title: string;
  children: React.ReactNode;
}

const ResultSection = ({ title, children }: ResultSectionProps) => {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.results}>{children}</div>
    </section>
  );
};

interface SearchResultCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  to?: string;
  externalUrl?: string;
}

const SearchResultCard = ({
  title,
  subtitle,
  imageUrl,
  to,
  externalUrl,
}: SearchResultCardProps) => {
  const content = (
    <>
      {imageUrl ? (
        <img className={styles.image} src={imageUrl} alt="" />
      ) : (
        <div className={styles.imagePlaceholder} aria-hidden="true" />
      )}

      <span className={styles.cardContent}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
    </>
  );

  if (to) {
    return (
      <Link className={styles.card} to={to}>
        {content}
      </Link>
    );
  }

  if (externalUrl) {
    return (
      <a
        className={styles.card}
        href={externalUrl}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return <div className={styles.card}>{content}</div>;
};

export default SearchPage;
