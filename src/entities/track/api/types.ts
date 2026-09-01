export interface SpotifyRecentTrack {
  track: {
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
    artists: {
      name: string;
    }[];
    album: {
      name: string;
      images: {
        url: string;
      }[];
    };
  };
  played_at: string;
}
