import type {
  SpotifyExternalUrls,
  SpotifyImage,
  SpotifyOwner,
  SpotifySimplifiedArtist,
} from "../../../shared/API/typesCommon";

export interface SpotifySearchTrack {
  id: string;
  name: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
  artists: SpotifySimplifiedArtist[];
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
  };
}

export interface SpotifySearchArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
  images: SpotifyImage[];
}

export interface SpotifySearchAlbum {
  id: string;
  name: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
  images: SpotifyImage[];
  artists: SpotifySimplifiedArtist[];
}

export interface SpotifySearchPlaylist {
  id: string;
  name: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
  images: SpotifyImage[] | null;
  owner?: SpotifyOwner | null;
}

export interface SpotifySearchShow {
  id: string;
  name: string;
  uri: string;
  description?: string;

  external_urls: SpotifyExternalUrls;
  images: SpotifyImage[];
}

export interface SpotifyPage<T> {
  items: Array<T | null>;
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SpotifySearchResponse {
  tracks?: SpotifyPage<SpotifySearchTrack>;
  artists?: SpotifyPage<SpotifySearchArtist>;
  albums?: SpotifyPage<SpotifySearchAlbum>;
  playlists?: SpotifyPage<SpotifySearchPlaylist>;
  shows?: SpotifyPage<SpotifySearchShow>;
}