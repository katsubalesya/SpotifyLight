import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { CreatePlaylistData, SpotifyPlaylistsResponse } from "./types";

export const createPlaylist = (
  playlistData: CreatePlaylistData,
): Promise<SpotifyPlaylistsResponse> => {
  return spotifyFetch<SpotifyPlaylistsResponse>("/me/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playlistData),
  });
};