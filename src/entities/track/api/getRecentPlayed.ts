// https://developer.spotify.com/documentation/web-api/reference/get-recently-played?utm_source=chatgpt.com
import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { RecentTrack } from "../model/types";
import type { SpotifyRecentTrack } from "./types";

interface RecentlyPlayedResponse {
  items: SpotifyRecentTrack[];
}

export const getRecentlyPlayed = async (): Promise<RecentTrack[]> => {
  const data = await spotifyFetch<RecentlyPlayedResponse>(
    `/me/player/recently-played?limit=20`,
  );

  return data.items.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    artistName: item.track.artists[0]?.name ?? "Unknown artist",
    albumName: item.track.album.name,
    imageUrl: item.track.album.images[0]?.url ?? null,
    externalUrl: item.track.external_urls.spotify,
    playedAt: item.played_at,
  }));
};
