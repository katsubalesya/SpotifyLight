import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { CreatePlaylistData, SpotifyPlaylist } from "./types";

export const createPlaylist = (
  playlistData: CreatePlaylistData,
): Promise<SpotifyPlaylist> => {
  return spotifyFetch<SpotifyPlaylist>("/me/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playlistData),
  });
};