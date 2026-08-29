export interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}
export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifySimplifiedArtist {
  id: string;
  name: string;
}

export interface SpotifyArtist extends SpotifySimplifiedArtist {
  uri: string;
  external_urls: SpotifyExternalUrls;
  images: SpotifyImage[];
  genres?: string[];
  }

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  preview_url: string | null;
  artists: SpotifySimplifiedArtist[];
  album?: {
    name: string;
    images: SpotifyImage[];
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  label?: string;
  release_date: string;
  total_tracks: number;
  images: SpotifyImage[];
  artists: SpotifySimplifiedArtist[];
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SpotifySimplifiedAlbum {
  id: string;
  name: string;
  album_type: "album" | "single" | "compilation";
  release_date: string;
  total_tracks: number;
  images: SpotifyImage[];
  artists: SpotifySimplifiedArtist[];
  external_urls: SpotifyExternalUrls;
  uri: string;
}

export interface SpotifyArtistAlbumsResponse {
  items: SpotifySimplifiedAlbum[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  duration_ms: number;
  audio_preview_url: string | null;
  release_date: string;
  images: SpotifyImage[];
}

export interface SpotifyOwner {
  display_name?: string | null;
}

