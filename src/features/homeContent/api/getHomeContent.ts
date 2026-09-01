import { spotifyFetch } from "../../../shared/API/fetchRequest";
import { mapAlbumToHomeCard, mapArtistToHomeCard, mapPlaylistToHomeCard, mapShowToHomeCard } from "../model/mapHomeContent";

import type {
  HomeContentType,
  HomeSearchResponse,
} from "./types";

const searchSpotify = (
  query: string,
  type: HomeContentType,
  market = "PL",
) => {
  const params = new URLSearchParams({
    q: query,
    type,
    limit: "8",
    market,
  });

  return spotifyFetch<HomeSearchResponse>(
    `/search?${params.toString()}`,
  );
};

const isNotNull = <T>(item: T | null): item is T => {
  return item !== null;
}; 

export const getHomeContent = async () => {
  const [playlists, artists, shows, albums] =
    await Promise.allSettled([
      searchSpotify("global hits", "playlist"),
      searchSpotify("genre:pop", "artist"),
      searchSpotify("popular", "show"),
      searchSpotify("tag:new", "album"),
    ]);

  return {
    playlists:
      playlists.status === "fulfilled"
        ? (playlists.value.playlists?.items ?? [])
        .filter(isNotNull)
        .map(mapPlaylistToHomeCard)
        : [],

    artists:
      artists.status === "fulfilled"
        ? (artists.value.artists?.items ?? [])
        .filter(isNotNull)
        .map(mapArtistToHomeCard)
        : [],

    podcasts:
      shows.status === "fulfilled"
        ? (shows.value.shows?.items ?? [])
        .filter(isNotNull)
        .map(mapShowToHomeCard)
        : [],

    albums:
      albums.status === "fulfilled"
        ? (albums.value.albums?.items ?? [])
        .filter(isNotNull)
        .map(mapAlbumToHomeCard)
        : [],
  };
};