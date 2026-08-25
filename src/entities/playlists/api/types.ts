import type {
  SpotifyExternalUrls,
  SpotifyImage,
  SpotifyTrack,
} from "../../../shared/API/typesCommon";

export interface SpotifyPlaylistTrackItem {
  track: SpotifyTrack | null;
}

export interface ISpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  collaborative: boolean;
  public: boolean;
  images: SpotifyImage[] | null;
  external_urls: SpotifyExternalUrls;
  owner: {
    display_name: string;
  };
  tracks: {
    href: string;
    total: number;
    items: SpotifyPlaylistTrackItem[];
  };
}

export interface SpotifyPlaylistsResponse {
//   items: ISpotifyPlaylist[];
//   limit: number;
//   offset: number;
//   total: number;
//   next: string | null;
//   previous: string | null;
collaborative: boolean;
  description: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: Array<{
    width: number | null;
    height: number | null;
    url: string;
  }> | null;
  name: string;
  owner: { display_name: string };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: { href: string; total: number; items: SpotifyPlaylistTrackItem[] };
  type: string;
  uri: string;
}

export interface LoadPlaylistsResponse {
  href: string;
  items: Array<SpotifyPlaylistsResponse>;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}