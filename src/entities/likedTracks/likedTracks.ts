import { spotifyFetch } from "../../shared/API/fetchRequest";

const getTrackUri = (trackId: string) => `spotify:track:${trackId}`;

export const checkTrackIsLiked = async (
  trackId: string,
  signal?: AbortSignal,
): Promise<boolean> => {
  const uri = getTrackUri(trackId);

  const result = await spotifyFetch<boolean[]>(
    `/me/library/contains?uris=${encodeURIComponent(uri)}`,
    { signal },
  );

  return result[0] ?? false;
};

export const saveTrackToLiked = async (
  trackId: string,
): Promise<void> => {
  const uri = getTrackUri(trackId);

  await spotifyFetch<void>(
    `/me/library?uris=${encodeURIComponent(uri)}`,
    { method: "PUT" },
  );
};

export const removeTrackFromLiked = async (
  trackId: string,
): Promise<void> => {
  const uri = getTrackUri(trackId);

  await spotifyFetch<void>(
    `/me/library?uris=${encodeURIComponent(uri)}`,
    { method: "DELETE" },
  );
};