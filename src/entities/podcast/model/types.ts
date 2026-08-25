export interface IPodcast {
  id: string;
  name: string;
  uri: string;
  externalUrl: string;
  imageUrl: string | null;
  publisher: string;
  description: string;
  totalEpisodes: number;
}