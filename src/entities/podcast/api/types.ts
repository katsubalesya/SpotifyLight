import type { SpotifyEpisode, SpotifyImage } from "../../../shared/API/typesCommon";

export interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  total_episodes: number;
  images: SpotifyImage[];
  episodes: {
    items: SpotifyEpisode[];
  };
}

export interface SpotifySavedPodcast {
    show: {
        id: string;
        name: string;
        uri: string;
        external_urls: {
            spotify: string;
        };
        images: SpotifyImage[];
        description: string;
        total_episodes: number;
    }
}