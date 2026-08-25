import styles from "./PlayListPage.module.css";

import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useParams } from "react-router-dom";

import { useAccessToken } from "../../entities/hooks/useAccessToken";
import type { SpotifyPlaylistsResponse } from "../../entities/playlists/api/types";
import { spotifyFetch } from "../../shared/API/fetchRequest";
import { TrackList } from "../../entities/trackList/ui/trackList";
import type { ITrackRow } from "../../entities/trackrow/model/types";
import { usePlayer } from "../../widgets/Player/playerContext";

const PlayListPage: FC = () => {
  const token = useAccessToken();
  const { id } = useParams();

  const [currentPlaylist, setCurrentPlaylist] =
    useState<SpotifyPlaylistsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentTrack, isPlaying, playTrack } = usePlayer();

  const loadCurrentPlaylist = useCallback(
    async (id: string) => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const data = await spotifyFetch<SpotifyPlaylistsResponse>(
          `/playlists/${id}`,
        );

        setCurrentPlaylist(data);
      } catch (requestError) {
        console.error("Failed to load playlist:", requestError);
        setError("Failed to load playlist. Try refreshing the page.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!id) return;
    void loadCurrentPlaylist(id);
  }, [id, loadCurrentPlaylist]);

  const tracks = useMemo<ITrackRow[]>(() => {
    if (!currentPlaylist) return [];

    return currentPlaylist.tracks.items.flatMap(({ track }) => {
      if (!track) return [];

      return [
        {
          id: track.id,
          title: track.name,
          artists: track.artists.map((artist) => artist.name),
          album: track.album?.name,
          imageUrl: track.album?.images[0]?.url ?? null,
          durationMs: track.duration_ms,
          previewUrl: track.preview_url,
        },
      ];
    });
  }, [currentPlaylist]);

  const handleTrackPlay = (track: ITrackRow) => {
    playTrack(track, tracks);
  };

  return (
    <section>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <h1>{currentPlaylist?.name}</h1>
      <div>ID: {currentPlaylist?.id}</div>
      <img
        src={currentPlaylist?.images?.[0]?.url}
        alt={currentPlaylist?.name}
      />
      <p>{currentPlaylist?.description}</p>
      <p>Owner: {currentPlaylist?.owner?.display_name}</p>
      <p>Tracks: {currentPlaylist?.tracks?.total}</p>

      <div className={styles.content}>
        <TrackList
          tracks={tracks}
          currentTrackId={isPlaying ? currentTrack?.id : undefined}
          onTrackPlay={handleTrackPlay}
          onTrackMoreClick={(track) => {
            console.log("Open track menu:", track.title);
          }}
          emptyMessage="There are no tracks in this playlist yet."
        />
      </div>

      {/* Список в доработке*/}
      {/* {currentPlaylist?.tracks?.items?.map(({ track }: any) => (
        <div key={track.id}>
          {track.name} —{" "}
          {track.artists.map((artist: any) => artist.name).join(", ")}
        </div>
      ))} * */}
    </section>
  );
};

export default PlayListPage;
