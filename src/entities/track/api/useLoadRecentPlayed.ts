// import { useCallback, useState } from "react";
// import { useAccessToken } from "../../hooks/useAccessToken";
// import { getRecentlyPlayed } from "./getRecentPlayed";
// import type { IRecentTrack } from "../model/types";

// interface IUseLoadRecentlyPlayed {
//   tracks: IRecentTrack[];
//   isLoading: boolean;
//   error: string | null;
//   loadRecentlyPlayed: () => Promise<void>;
// }

// export const useLoadRecentlyPlayed = (): IUseLoadRecentlyPlayed => {
//   const token = useAccessToken();

//   const [tracks, setTracks] = useState<IRecentTrack[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadRecentlyPlayed = useCallback(async () => {
//     if (!token) {
//       setError("Access token is missing");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const data = await getRecentlyPlayed(token);

//       setTracks(data);
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to load recently played tracks",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token]);

//   return {
//     tracks,
//     isLoading,
//     error,
//     loadRecentlyPlayed,
//   };
// };
