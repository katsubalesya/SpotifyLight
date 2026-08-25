// https://developer.spotify.com/documentation/web-api/reference/get-recently-played?utm_source=chatgpt.com
import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { IRecentTrack } from "../model/types";

interface ISpotifyRecentTrack {
  track: {
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
    artists: {
      name: string;
    }[];
    album: {
      name: string;
      images: {
        url: string;
      }[];
    };
  };
  played_at: string;
}

interface IRecentlyPlayedResponse {
  items: ISpotifyRecentTrack[];
}

export const getRecentlyPlayed = async (): 
Promise<IRecentTrack[]> => {
  const data = await spotifyFetch<IRecentlyPlayedResponse>(`/me/player/recently-played?limit=20`);


//   token: string
// ): Promise<IRecentTrack[]> => {
//   const response = await fetch(
//     "https://api.spotify.com/v1/me/player/recently-played?limit=20",
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Spotify error: ${response.status}`);
//   }

//   const data: IRecentlyPlayedResponse = await response.json();

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