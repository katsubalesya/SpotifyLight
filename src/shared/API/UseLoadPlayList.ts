// import { useAccessToken } from "@/hooks/use-access-token";
// import { useState } from "react";
// import { makeRequest } from "./make-request";

// export interface IPlaylistResponse {
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
//   items: { href: string; total: number };
//   name: string;
//   owner: { display_name: string };
//   primary_color: string | null;
//   public: boolean;
//   snapshot_id: string;
//   tracks: { href: string; total: number };
//   type: string;
//   uri: string;
// }

// interface ILoadPlaylistsResponse {
//   href: string;
//   items: Array<IPlaylistResponse>;
//   limit: number;
//   next: number | null;
//   offset: number;
//   previous: number | null;
//   total: number;
// }

// export const useLoadPlaylist = () => {
//   const [playlists, setPlaylists] = useState<IPlaylistResponse[]>([]);
//   const [isLoading, setLoading] = useState(false);
//   const token = useAccessToken();

//   const load = async () => {
//     if (!token) return;

//     setLoading(true);
//     const response: ILoadPlaylistsResponse = await makeRequest(
//       "https://api.spotify.com/v1/me/playlists",
//     );
//     setLoading(false);
//     setPlaylists(response.items);
//   };

//   return {
//     load,
//     playlists,
//     isLoading,
//   };
// };