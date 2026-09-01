export interface Podcast {
  id: string;
  name: string;
  uri: string;
  externalUrl: string;
  imageUrl: string | null;
  description: string;
  totalEpisodes: number;
}