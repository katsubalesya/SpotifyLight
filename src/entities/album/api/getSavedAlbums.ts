import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { Album } from "../model/types";
import type { SpotifySavedAlbum } from "./types";

interface SavedAlbumsResponse {
    items: SpotifySavedAlbum[];
}

export const getSavedAlbums = async ( ): Promise<Album[]> => {
    const data = await spotifyFetch<SavedAlbumsResponse>(
      (`/me/albums?limit=50`)
    )
    
  return data.items.map((item) => ({
    id: item.album.id,
    name: item.album.name,
    uri: item.album.uri,
    externalUrl: item.album.external_urls.spotify,
    imageUrl: item.album.images[0]?.url ?? null,
    artistName: item.album.artists[0]?.name ?? "Unknown artist",
    releaseDate: item.album.release_date,
    totalTracks: item.album.total_tracks,
  }))
}