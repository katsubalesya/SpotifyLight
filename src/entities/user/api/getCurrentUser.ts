import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { SpotifyProfile } from "./types";

export const getCurrentUser = (
  signal?: AbortSignal,
): Promise<SpotifyProfile> => {
  return spotifyFetch<SpotifyProfile>
  ("/me", {
    signal,
  });
};