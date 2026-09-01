import type { SpotifyExternalUrls, SpotifyImage } from "../../../shared/API/typesCommon";

export interface SpotifyProfile {
  account_id: string;
  display_name: string | null;

  images: SpotifyImage[];

  external_urls: SpotifyExternalUrls
}