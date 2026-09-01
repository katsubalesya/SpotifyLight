export interface RecentTrack {
  id: string;
  name: string;
  artistName: string;
  albumName: string;
  imageUrl: string | null;
  externalUrl: string;
  playedAt: string;
}

// previewUrl?: string | null; по этому адресу HTML-аудиоплеер получает звуковой файл.
export interface TrackRow {
  id: string;
  uri: string;
  type: "track" | "episode";
  title: string;
  artists: string[];
  album?: string;
  imageUrl?: string | null;
  durationMs?: number;
  externalUrl?: string;
}

