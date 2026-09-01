import type { SpotifyPlaylist } from "../api/types";
import type { Playlist} from "./types";

export const mapSpotifyPlaylists = (list: SpotifyPlaylist[]): Playlist[] => {
  return list.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    ownerName: playlist.owner?.display_name ?? "Unknown owner",
    externalUrl: playlist.external_urls.spotify,
    mainImage: playlist.images?.[0]?.url ?? null,
  }));
};
