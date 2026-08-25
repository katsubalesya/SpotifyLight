import type { SpotifyExternalUrls, SpotifyImage } from "../../../shared/API/typesCommon";

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
  images: SpotifyImage[];
}