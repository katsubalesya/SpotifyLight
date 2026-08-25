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
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
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
  label: string;
  release_date: string;
  total_tracks: number;
  images: SpotifyImage[];
  artists: SpotifySimplifiedArtist[];
  tracks: {
    items: SpotifyTrack[];
  };
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

