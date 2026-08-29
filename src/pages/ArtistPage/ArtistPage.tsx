import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "../../entities/pageHeader/pageHeader";
import { spotifyFetch } from "../../shared/API/fetchRequest";
import type { SpotifyArtist, SpotifyArtistAlbumsResponse, SpotifySimplifiedAlbum} from "../../shared/API/typesCommon";
import { PageContainer } from "../../shared/UI/pageContainer";

import styles from "./ArtistPage.module.css";

const ArtistPage = () => {
  const { artistId } = useParams<{ artistId: string }>();

  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [albums, setAlbums] = useState<SpotifySimplifiedAlbum[]>([]);
  const [albumsTotal, setAlbumsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!artistId ) {
      setError("Failed to retrieve artist data.");
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();

    const loadArtist = async () => {
      try {
        setIsLoading(true);
        setError("");
        setActionError("");

        const [artistData, albumsData] = await Promise.all([
          spotifyFetch<SpotifyArtist>(`/artists/${artistId}`,{signal: controller.signal}),
          spotifyFetch<SpotifyArtistAlbumsResponse>(`/artists/${artistId}/albums?include_groups=album,single&limit=10`, {signal:controller.signal}),
        ]);

        setArtist(artistData);
        setAlbums(albumsData.items);
        setAlbumsTotal(albumsData.total)

        const artistUri = `spotify:artist:${artistId}`;

       try {
        const savedData = await spotifyFetch<boolean[]>(
          `/me/library/contains?uris=${encodeURIComponent(artistUri)}`,
          { signal: controller.signal },
        );

        setIsSaved(savedData[0] ?? false);
      } catch (savedStateError) {
        if (
          savedStateError instanceof DOMException &&
          savedStateError.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to check whether artist is saved:",
          savedStateError,
        );

        setIsSaved(false);
      }
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        return;
      }

      console.error("Failed to load artist:", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load artist. Try refreshing the page.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  void loadArtist();

  return () => {
    controller.abort();
  };
}, [artistId]);
      
    const handleSaveArtist = async () => {
    if (!artistId) return;

    try {
      setActionError("");
      const artistUri = `spotify:artist:${artistId}`;

      await spotifyFetch<void>(
        `/me/library?uris=${encodeURIComponent(artistUri)}`,
        {
          method: isSaved ? "DELETE" : "PUT",
        },
      );

      setIsSaved((currentValue) => !currentValue);
    } catch (requestError) {
      console.error(requestError);

      setActionError(
        requestError instanceof Error ? requestError.message : "Failed to update the artist in your library.",
      )
    }
  };

  if (isLoading) {
    return (<section className={styles.state} aria-live="polite">Loading artist...</section>);
  }

  if (error || !artist) {
    return (<section className={styles.state} role="alert">{error || "Artist not found."}</section>);
  }

  return (
    <PageContainer>
      <PageHeader
        type="artist"
        title={artist.name}
        imageUrl={artist.images[0]?.url}
        // description={
        //   artist.genres?.length ? artist.genres.join(", ") : undefined
        // }
        meta={[`${albumsTotal} releases`]}
        // isPlaying={
        //   isPlaying && tracks.some(({ id }) => id === currentTrack?.id)
        // }
        isSaved={isSaved}
        // onPlay={handleArtistPlay}
        onSave={handleSaveArtist}
      />

      <PageContainer.Content>
        {actionError && (
          <p className={styles.actionError} role="alert">
            {actionError}
          </p>
        )}

        <section
          className={styles.releases}
          aria-labelledby="artist-releases-title"
        >
          <h2 id="artist-releases-title">Releases</h2>

          {albums.length === 0 ? (
            <p className={styles.empty}>No releases found.</p>
          ) : (
            <div className={styles.albumGrid}>
              {albums.map((album) => (
                <Link
                  key={album.id}
                  to={`/albums/${album.id}`}
                  className={styles.albumCard}
                >
                  {album.images[0]?.url ? (
                    <img
                      className={styles.albumCover}
                      src={album.images[0].url}
                      alt={`${album.name} cover`}
                    />
                  ) : (
                    <div
                      className={styles.albumPlaceholder}
                      aria-hidden="true"
                    >
                      ♪
                    </div>
                  )}

                  <strong className={styles.albumTitle}>
                    {album.name}
                  </strong>

                  <span className={styles.albumMeta}>
                    {album.release_date.slice(0, 4)}
                    {" · "}
                    {album.album_type}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </PageContainer.Content>
    </PageContainer>
  );
};

export default ArtistPage;
