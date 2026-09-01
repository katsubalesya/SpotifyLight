import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useParams } from "react-router-dom";

import { useAccessToken } from "../../features/auth/model/useAccessToken";
import type { SpotifyPlaylist } from "../../entities/playlists/api/types";
import { spotifyFetch } from "../../shared/API/fetchRequest";
import { TrackList } from "../../entities/track/ui/trackList";
import { usePlayer } from "../../widgets/Player/playerContext";
import { PageContainer } from "../../shared/UI/pageContainer";
import type { TrackRowData } from "../../entities/track";

const PlayListPage: FC = () => {
  const token = useAccessToken();
  const { id } = useParams();

  const [currentPlaylist, setCurrentPlaylist] =
    useState<SpotifyPlaylist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentTrack, isPlaying, playTrack } = usePlayer();

  const loadCurrentPlaylist = useCallback(
    async (id: string) => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const data = await spotifyFetch<SpotifyPlaylist>(`/playlists/${id}`);

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

  const tracks = useMemo<TrackRowData[]>(() => {
    const playlistItems = currentPlaylist?.items;
    if (!playlistItems) return [];

    return playlistItems.items.flatMap(({ item }) => {
      if (!item) {
        return [];
      }
      if (item.type !== "track") {
        return [];
      }

      return [
        {
          id: item.id,
          uri: item.uri,
          type: item.type,
          title: item.name,
          artists: item.artists.map((artist) => artist.name),
          album: item.album?.name,
          imageUrl: item.album?.images[0]?.url ?? null,
          durationMs: item.duration_ms,
          externalUrl: item.external_urls.spotify,
        },
      ];
    });
  }, [currentPlaylist]);

  const handleTrackPlay = (track: TrackRowData) => {
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
    </PageContainer>
  );
};

export default PlayListPage;
