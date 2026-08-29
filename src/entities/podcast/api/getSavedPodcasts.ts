import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { IPodcast } from "../model/types";
import type { ISpotifySavedPodcast } from "./types";


interface ISavedPodcastsResponse {
    items: ISpotifySavedPodcast[];
}

export const getSavedPodcasts = async (): Promise<IPodcast[]> => {

  const data = await spotifyFetch<ISavedPodcastsResponse>(
    (`/me/shows?limit=50`)
  )
    return data.items.map((item) => ({
    id: item.show.id,
    name: item.show.name,
    uri: item.show.uri,
    externalUrl: item.show.external_urls.spotify,
    imageUrl: item.show.images[0]?.url ?? null,
    publisher: item.show.publisher ?? "Podcast",
    description: item.show.description,
    totalEpisodes: item.show.total_episodes,
  }))
}
