// import type { SpotifyPlaylistTrackItem } from "../api/types";

export interface Playlist {
    id: string;
    name: string;
    ownerName: string;
    externalUrl: string;
    mainImage?: string | null;
}

// export interface IPlaylistTrack {
//   track: {
//     id: string;
//     name: string;
//     duration_ms: number;
//     preview_url: string | null;
//     artists: Array<{ id: string; name: string }>;
//     album: {
//       name: string;
//       images: Array<{
//         url: string;
//         width: number | null;
//         height: number | null;
//       }>;
//     };
//   } | null;
// }

// export interface PlaylistResponse {
//   collaborative: boolean;
//   description: string;
//   external_urls: { spotify: string };
//   href: string;
//   id: string;
//   images: Array<{
//     width: number | null;
//     height: number | null;
//     url: string;
//   }> | null;
//   name: string;
//   owner: { display_name: string };
//   primary_color: string | null;
//   public: boolean;
//   snapshot_id: string;
//   tracks: { href: string; total: number; items: SpotifyPlaylistTrackItem[] };
//   type: string;
//   uri: string;
// }

// export interface ILoadPlaylistsResponse {
//   href: string;
//   items: Array<IPlaylistResponse>;
//   limit: number;
//   next: string | null;
//   offset: number;
//   previous: string | null;
//   total: number;
// }