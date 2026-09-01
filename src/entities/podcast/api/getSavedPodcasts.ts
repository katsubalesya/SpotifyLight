import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { Podcast } from "../model/types";
import type { SpotifySavedPodcast } from "./types";


interface SavedPodcastsResponse {
    items: SpotifySavedPodcast[];
}

export const getSavedPodcasts = async (): Promise<Podcast[]> => {

  const data = await spotifyFetch<SavedPodcastsResponse>(
    (`/me/shows?limit=50`)
  )
    return data.items.map((item) => ({
    id: item.show.id,
    name: item.show.name,
    uri: item.show.uri,
    externalUrl: item.show.external_urls.spotify,
    imageUrl: item.show.images[0]?.url ?? null,
    description: item.show.description,
    totalEpisodes: item.show.total_episodes,
  }))
}
