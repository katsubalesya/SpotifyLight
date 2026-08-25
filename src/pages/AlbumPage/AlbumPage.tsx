import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// import { useAccessToken } from "../../entities/hooks/useAccessToken";
import { TrackList } from "../../entities/trackList/ui/trackList";
import type { ITrackRow } from "../../entities/trackrow/model/types";
import { PageHeader } from "../../entities/pageHeader/pageHeader";
import { usePlayer } from "../../widgets/Player/playerContext";

import styles from "./AlbumPage.module.css";
import { spotifyFetch } from "../../shared/API/fetchRequest";
import type { SpotifyAlbum } from "../../shared/API/typesCommon";

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();

  const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  useEffect(() => {
    if (!albumId) return;

    const loadAlbum = async () => {
      const albumData = await spotifyFetch<SpotifyAlbum>(`/albums/${albumId}`);

      const savedData = await spotifyFetch<boolean[]>(
        `/me/albums/contains?ids=${albumId}`,
      );

      setAlbum(albumData);
      setIsSaved(savedData[0]);
    };

    loadAlbum();
  }, [albumId]);

  const tracks = useMemo<ITrackRow[]>(() => {
    if (!album) return [];

    return album.tracks.items.map((track) => ({
      id: track.id,
      title: track.name,
      artists: track.artists.map((artist) => artist.name),
      album: album.name,
      imageUrl: album.images[0]?.url ?? null,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
    }));
  }, [album]);

  const handleTrackPlay = (track: ITrackRow) => {
    playTrack(track, tracks);
  };

  const handleAlbumPlay = () => {
    const firstTrack = tracks[0];

    if (!firstTrack) return;

    const currentAlbumTrackPlaying = tracks.some(
      (track) => track.id === currentTrack?.id,
    );

    if (currentAlbumTrackPlaying) {
      togglePlay();
    } else {
      playTrack(firstTrack, tracks);
    }
  };

  const handleSaveAlbum = async () => {
    if (!albumId) return;

    await spotifyFetch<void>(`/me/albums?ids=${albumId}`, {
      method: isSaved ? "DELETE" : "PUT",
    });

    setIsSaved(!isSaved);
  };

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.page}>
      <PageHeader
        type="album"
        title={album.name}
        imageUrl={album.images[0]?.url}
        description={album.label}
        meta={[
          album.artists.map((artist) => artist.name).join(", "),
          album.release_date.slice(0, 4),
          `${album.total_tracks} tracks`,
        ]}
        isPlaying={
          isPlaying && tracks.some(({ id }) => id === currentTrack?.id)
        }
        isSaved={isSaved}
        onPlay={handleAlbumPlay}
        onSave={handleSaveAlbum}
      />

      <div className={styles.content}>
        <TrackList
          tracks={tracks}
          currentTrackId={isPlaying ? currentTrack?.id : undefined}
          onTrackPlay={handleTrackPlay}
          onTrackMoreClick={(track) => {
            console.log("Open track menu:", track.title);
          }}
          emptyMessage="There are no tracks in this album yet."
        />
      </div>
    </section>
  );
};

export default AlbumPage;
