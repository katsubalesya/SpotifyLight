import type {
  SpotifyEpisode,
  SpotifyExternalUrls,
  SpotifyImage,
  SpotifyTrack,
} from "../../../shared/API/typesCommon";

export interface SpotifyPlaylist {
  collaborative: boolean;
  type: "playlist";
  id: string;
  name: string;
  owner: SpotifyPlaylistOwner | null;
  external_urls: SpotifyExternalUrls;
  description: string | null;
  images: SpotifyImage[] | null;
  href: string;
  public: boolean | null;
  snapshot_id: string;
  items?: SpotifyPlaylistItemsResponse;
  uri: string;
}

export interface SpotifyPaging<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}

export interface SpotifyPlaylistOwner {
  id: string;
  display_name: string | null;
  external_urls: SpotifyExternalUrls;
  href: string;
  type: "user";
  uri: string;
}

export interface SpotifyPlaylistItem {
  added_at: string | null;
  item: SpotifyTrack | SpotifyEpisode | null;
}

// список плейлистов
export type SpotifyPlaylistsResponse = SpotifyPaging<SpotifyPlaylist>;

// список треков/эпизодов одного плейлиста
export type SpotifyPlaylistItemsResponse = SpotifyPaging<SpotifyPlaylistItem>;

export interface CreatePlaylistData {
  name: string;
  description?: string;
  public?: boolean;
}
