// import { useEffect, useState } from "react";
// import type { IPlaylistResponse } from "./use-load-playlists";
// import { makeRequest } from "./make-request";

// export const useLoadCurrentPlaylist = (id?: string) => {
//   const [currentPlaylist, setCurrentPlaylist] =
//     useState<IPlaylistResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {

//     let cancelled = false;

//     const load = async () => {
//       setIsLoading(true);
//       const response: IPlaylistResponse = await makeRequest(
//         `https://api.spotify.com/v1/playlists/${id}`,
//       );
      
//       if (!cancelled) {
//         setCurrentPlaylist(response);
//         setIsLoading(false);
//       }
//     };

//     void load();

//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   return {
//     currentPlaylist,
//     isLoading,
//   };
// };

// // 2. Сохранение плейстов
// // 3. Загрузка плейлиста
// // 4. Описание запроса
// // 5. isLoading
// // 6. Зависимость от способа отправки запроса