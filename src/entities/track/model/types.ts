export interface IRecentTrack {
  id: string;
  name: string;
  artistName: string;
  albumName: string;
  imageUrl: string | null;
  externalUrl: string;
  playedAt: string;
}