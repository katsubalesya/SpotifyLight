export interface Album {
  id: string;
  name: string;
  uri: string;
  externalUrl: string;
  imageUrl: string | null;
  artistName: string;
  releaseDate: string;
  totalTracks: number;
}