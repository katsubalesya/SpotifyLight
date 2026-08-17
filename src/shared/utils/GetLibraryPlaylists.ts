import type { IPlaylistResponse } from "../API/UseLoadPlayList";

export const getLibraryPlaylists = (list: IPlaylistResponse[]) => {
  if(!list) return [];
  
  return list.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    ownerName: playlist.owner.display_name,
  }));
}
  
