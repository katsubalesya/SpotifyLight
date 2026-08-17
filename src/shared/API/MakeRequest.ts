import { spotifyFetch } from "./SpotifyApi";

export const makeRequest = async <T>(path: string, options?: RequestInit) =>
  spotifyFetch<T>(path, options);
