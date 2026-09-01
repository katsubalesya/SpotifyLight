import type {
  SpotifyEpisode,
  SpotifyExternalUrls,
  SpotifyImage,
  SpotifyTrack,
} from "../../../shared/API/typesCommon";

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string | null;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[] | null;
  name: string;
  owner: SpotifyPlaylistOwner | null;
  // primary_color: string | null;
  public: boolean | null;
  snapshot_id: string;
  items?: SpotifyPlaylistItemsResponse;
  type: "playlist";
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
export type SpotifyPlaylistsResponse =  SpotifyPaging<SpotifyPlaylist>;

// список треков/эпизодов одного плейлиста
export type SpotifyPlaylistItemsResponse = SpotifyPaging<SpotifyPlaylistItem>;

export interface CreatePlaylistData {
  name: string;
  description?: string;
  public?: boolean;
}
