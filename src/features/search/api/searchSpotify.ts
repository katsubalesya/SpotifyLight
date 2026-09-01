import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { SpotifySearchResponse } from "./types";

export const searchSpotify = (
    query: string,
    signal?: AbortSignal,
): Promise <SpotifySearchResponse> => {
    const params = new URLSearchParams ({
        q: query.trim(),
        type: "track,artist,album,playlist,show",
        limit: "10",
        offset: "0",
    });

    return spotifyFetch<SpotifySearchResponse>(
        `/search?${params.toString()}`,
        {signal}
    )

}

