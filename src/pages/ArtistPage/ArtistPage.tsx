import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useAccessToken } from "../../entities/hooks/useAccessToken";
import { TrackList } from "../../entities/trackList/ui/trackList";
import type { ITrackRow } from "../../entities/trackrow/model/types";
import { PageHeader } from "../../entities/pageHeader/pageHeader";
import { usePlayer } from "../../widgets/Player/playerContext";

import styles from "./ArtistPage.module.css";
import type { SpotifyArtist, SpotifyTrack } from "../../shared/API/typesCommon";
import { spotifyFetch } from "../../shared/API/fetchRequest";

interface SpotifyTopTracksResponse {
  tracks: SpotifyTrack[];
}

const ArtistPage = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const token = useAccessToken();

  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [artistTracks, setArtistTracks] = useState<SpotifyTrack[]>([]);
  // const [tracksData, setTracksData] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  useEffect(() => {
    if (!artistId || !token) {
      setError("Failed to retrieve artist data.");
      setIsLoading(false);
      return;
    }

    const loadArtist = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [artistData, tracksData, savedData] = await Promise.all([
          spotifyFetch<SpotifyArtist>(`/artists/${artistId}`),
          spotifyFetch<SpotifyTopTracksResponse>(
            `/artists/${artistId}/top-tracks?market=PL`,
          ),
          spotifyFetch<boolean[]>(
            `/me/following/contains?type=artist&ids=${artistId}`,
          ),
        ]);

        setArtist(artistData);
        setArtistTracks(tracksData.tracks);
        setIsSaved(savedData[0] ?? false);
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to load artist. Try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadArtist();
  }, [artistId, token]);

  const tracks = useMemo<ITrackRow[]>(() => {
    return artistTracks.map((track) => ({
      id: track.id,
      title: track.name,
      artists: track.artists.map((trackArtist) => trackArtist.name),
      album: track.album?.name,
      imageUrl: track.album?.images[0]?.url ?? null,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
    }));
  }, [artistTracks]);

  const handleTrackPlay = (track: ITrackRow) => {
    playTrack(track, tracks);
  };

  const handleArtistPlay = () => {
    const firstTrack = tracks[0];

    if (!firstTrack) return;

    if (tracks.some(({ id }) => id === currentTrack?.id)) togglePlay();
    else playTrack(firstTrack, tracks);
  };

  const handleSaveArtist = async () => {
    if (!artistId || !token) return;

    try {
      await spotifyFetch<void>(`/me/following?type=artist&ids=${artistId}`, {
        method: isSaved ? "DELETE" : "PUT",
      });

      setIsSaved((value) => !value);
    } catch (requestError) {
      console.error(requestError);
    }
  };

  if (isLoading) {
    return <section className={styles.state}>Загрузка artist...</section>;
  }

  if (error || !artist) {
    return <section className={styles.state}>{error}</section>;
  }

  return (
    <section className={styles.page}>
      <PageHeader
        type="artist"
        title={artist.name}
        imageUrl={artist.images[0]?.url}
        description={
          artist.genres.length > 0 ? artist.genres.join(", ") : undefined
        }
        meta={[`${artist.popularity} folovers`, `${tracks.length} tracks`]}
        isPlaying={
          isPlaying && tracks.some(({ id }) => id === currentTrack?.id)
        }
        isSaved={isSaved}
        onPlay={handleArtistPlay}
        onSave={handleSaveArtist}
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

export default ArtistPage;
