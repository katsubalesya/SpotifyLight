import type { SpotifyPlaylistsResponse } from "../api/types";
import type { Playlist} from "./types";

export const mapSpotifyPlaylists = (list: SpotifyPlaylistsResponse[]): Playlist[] => {
  return list.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    ownerName: playlist.owner.display_name,
    externalUrl: playlist.external_urls.spotify,
    mainImage: playlist.images?.[0]?.url,
  }));
};
