import type {
  SpotifyExternalUrls,
  SpotifyImage,
  SpotifySimplifiedArtist,
} from "../../../shared/API/typesCommon";

export type HomeContentType =
  | "playlist"
  | "artist"
  | "show"
  | "album";

export type SpotifySearchPlaylist = {
  id: string;
  name: string;
  type: "playlist";
  description: string | null;
  images: SpotifyImage[] | null;
  external_urls: SpotifyExternalUrls;
  owner: {
    display_name: string | null;
  } | null;
};

export type SpotifySearchArtist = {
  id: string;
  name: string;
  type: "artist";
  genres?: string[];
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
};

export type SpotifySearchShow = {
  id: string;
  name: string;
  type: "show";
  description: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
};

export type SpotifySearchAlbum = {
  id: string;
  name: string;
  type: "album";
  artists: SpotifySimplifiedArtist[];
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
};

export type SearchPage<T> = {
  items: Array<T | null>;
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
};

export type HomeSearchResponse = {
  playlists?: SearchPage<SpotifySearchPlaylist>;
  artists?: SearchPage<SpotifySearchArtist>;
  shows?: SearchPage<SpotifySearchShow>;
  albums?: SearchPage<SpotifySearchAlbum>;
};