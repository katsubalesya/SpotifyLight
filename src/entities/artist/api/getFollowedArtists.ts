// https://developer.spotify.com/documentation/web-api/reference/get-followed?utm_source=chatgpt.com
import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { Artist } from "../model/types";
import type { SpotifyArtist } from "./types";

interface FollowedArtistsResponse {
  artists: { items: SpotifyArtist[] };
}

export const getFollowedArtists = async (): Promise<Artist[]> => {
  const data = await spotifyFetch<FollowedArtistsResponse>(
    `/me/following?type=artist&limit=50`,
  );

  return data.artists.items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    uri: artist.uri,
    externalUrl: artist.external_urls.spotify,
    imageUrl: artist.images[0]?.url ?? null,
  }));
};
