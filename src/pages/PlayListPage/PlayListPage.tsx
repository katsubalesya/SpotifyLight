import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useParams } from "react-router-dom";

import { useAccessToken } from "../../entities/hooks/useAccessToken";
import type { SpotifyPlaylistsResponse } from "../../entities/playlists/api/types";
import { spotifyFetch } from "../../shared/API/fetchRequest";
import { TrackList } from "../../entities/trackList/ui/trackList";
import type { TrackRow } from "../../entities/trackrow/model/types";
import { usePlayer } from "../../widgets/Player/playerContext";
import { PageContainer } from "../../shared/UI/pageContainer";

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

  const tracks = useMemo<TrackRow[]>(() => {
    if (!currentPlaylist?.items) return [];

    return currentPlaylist.items.items.flatMap(({ item }) => {
      if (!item) return [];

      return [
        {
          id: item.id,
          title: item.name,
          artists: item.artists.map((artist) => artist.name),
          album: item.album?.name,
          imageUrl: item.album?.images[0]?.url ?? null,
          durationMs: item.duration_ms,
          previewUrl: item.preview_url,
        },
      ];
    });
  }, [currentPlaylist]);

  const handleTrackPlay = (track: TrackRow) => {
    playTrack(track, tracks);
  };

  return (
    <PageContainer>
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
      <p>Tracks: {currentPlaylist?.items?.total ?? 0}</p>

      <PageContainer.Content>
        <TrackList
          tracks={tracks}
          currentTrackId={isPlaying ? currentTrack?.id : undefined}
          onTrackPlay={handleTrackPlay}
          onTrackMoreClick={(track) => {
            console.log("Open track menu:", track.title);
          }}
          emptyMessage="There are no tracks in this playlist yet."
        />
      </PageContainer.Content>

      {/* Список в доработке*/}
      {/* {currentPlaylist?.tracks?.items?.map(({ track }: any) => (
        <div key={track.id}>
          {track.name} —{" "}
          {track.artists.map((artist: any) => artist.name).join(", ")}
        </div>
      ))} * */}
    </PageContainer>
  );
};

export default PlayListPage;
