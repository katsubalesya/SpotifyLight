// import { useCallback, useState } from "react";
// import { getFollowedArtists } from "./getFollowedArtists";
// import type { IArtist } from "../model/types";
// import { useAccessToken } from "../../hooks/useAccessToken";

// interface IUseLoadArtists {
//   artists: IArtist[];
//   isLoading: boolean;
//   error: string | null;
//   loadArtists: () => Promise<void>;
// }

// export const useLoadArtists = (): IUseLoadArtists => {
//   const token = useAccessToken();

//   const [artists, setArtists] = useState<IArtist[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadArtists = useCallback(async () => {
//     if (!token) {
//       setError("Access token is missing");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const data = await getFollowedArtists(token);

//       setArtists(data);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Failed to load artists",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token]);

//   return {
//     artists,
//     isLoading,
//     error,
//     loadArtists,
//   };
// };
