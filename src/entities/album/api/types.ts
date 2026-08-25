import type { SpotifyArtist, SpotifyExternalUrls, SpotifyImage } from "../../../shared/API/typesCommon";

export interface SpotifySavedAlbum {
    album: {
        id: string;
        name: string;
        uri: string;
        external_urls: SpotifyExternalUrls;
        images: SpotifyImage[];
        artists:SpotifyArtist[];
        release_date: string;
        total_tracks: number;
    }
}