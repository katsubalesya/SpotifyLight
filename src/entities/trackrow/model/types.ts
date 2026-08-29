// previewUrl?: string | null; по этому адресу HTML-аудиоплеер получает звуковой файл.

export interface TrackRow {
  id: string;
  title: string;
  artists: string[];
  album?: string;
  imageUrl?: string | null;
  durationMs?: number;
  previewUrl?: string | null;
}
