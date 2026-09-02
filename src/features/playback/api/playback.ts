import { spotifyFetch } from "../../../shared/API/fetchRequest";

export const transferPlayback = (
  deviceId: string,
  play = false,
): Promise<void> => {
  return spotifyFetch<void>("/me/player", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play,
    }),
  });
};

export const startPlayback = (
  deviceId: string,
  uri: string,
): Promise<void> => {
  const params = new URLSearchParams({
    device_id: deviceId,
  });

  return spotifyFetch<void>(`/me/player/play?${params.toString()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: [uri],
    }),
  });
};

// body: JSON.stringify({
//   context_uri: "spotify:album:...",
//   offset: {
//     uri: "spotify:track:...",
//   },
//   position_ms: 0,
// })