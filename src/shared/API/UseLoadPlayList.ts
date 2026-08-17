import { useCallback, useState } from "react";
import { makeRequest } from "./MakeRequest";

export interface IPlaylistResponse {
  collaborative: boolean;
  description: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: Array<{
    width: number | null;
    height: number | null;
    url: string;
  }> | null;
  items: { href: string; total: number };
  name: string;
  owner: { display_name: string };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: { href: string; total: number };
  type: string;
  uri: string;
}

interface ILoadPlaylistsResponse {
  href: string;
  items: Array<IPlaylistResponse>;
  limit: number;
  next:  string | null;
  offset: number;
  previous:  string | null;
  total: number;
}

export const useLoadPlaylist = () => {
  const [playlists, setPlaylists] = useState<IPlaylistResponse[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await makeRequest<ILoadPlaylistsResponse>(
        "/me/playlists",
      );
      setPlaylists(response.items ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load playlists";
      console.error("Failed to load playlists:", message);
      setError(message);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    load,
    playlists,
    isLoading,
    error,
  };
};