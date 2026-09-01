import { useCallback, useState } from "react";

import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type {SpotifyPlaylistsResponse} from "../../../entities/playlists/api/types";
import { mapSpotifyPlaylists } from "../../../entities/playlists/model/mapSpotifyPlaylists";
import { useAccessToken } from "../../auth/model/useAccessToken";
import { createPlaylist as createPlaylistRequest } from "../../../entities/playlists/api/createPlaylist";
import { getFollowedArtists, type Artist } from "../../../entities/artist";
import { getSavedAlbums, type Album } from "../../../entities/album";
import { getSavedPodcasts, type Podcast } from "../../../entities/podcast";
import { getRecentlyPlayed, type RecentTrack } from "../../../entities/track";
import type { Playlist } from "../../../entities/playlists";

export type LibrarySection =
  | "playlists"
  | "artists"
  | "albums"
  | "podcasts"
  | "tracks";

type LibraryErrors = Partial<Record<LibrarySection, string>>;

const getErrorMessage = (reason: unknown) =>
  reason instanceof Error ? reason.message : "Failed to load this section";

export const useLibrary = () => {
  const token = useAccessToken();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [tracks, setTracks] = useState<RecentTrack[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectionErrors, setSectionErrors] = useState<LibraryErrors>({});

  const createPlaylist = useCallback(
    async (name: string) => {
      if (!token) {
        throw new Error("The user is not authorized");
      }

      const createdPlaylist = await createPlaylistRequest({
        name,
        description: "Created in SpLight",
        public: false,
      });

      const [newPlaylist] = mapSpotifyPlaylists([createdPlaylist]);

      setPlaylists((currentPlaylists) => [newPlaylist, ...currentPlaylists]);

      return newPlaylist;
    },
    [token],
  );

  const loadLibrary = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSectionErrors({});

      const playlistsPromise = spotifyFetch<SpotifyPlaylistsResponse>(
        `/me/playlists?limit=50`,
      ).then((data) => mapSpotifyPlaylists(data.items));

      const results = await Promise.allSettled([
        playlistsPromise,
        getFollowedArtists(),
        getSavedAlbums(),
        getSavedPodcasts(),
        getRecentlyPlayed(),
      ]);

      const [
        playlistsResult,
        artistsResult,
        albumsResult,
        podcastsResult,
        tracksResult,
      ] = results;

      if (playlistsResult.status === "fulfilled") {
        setPlaylists(playlistsResult.value);
      }

      if (artistsResult.status === "fulfilled") {
        setArtists(artistsResult.value);
      }

      if (albumsResult.status === "fulfilled") {
        setAlbums(albumsResult.value);
      }

      if (podcastsResult.status === "fulfilled") {
        setPodcasts(podcastsResult.value);
      }

      if (tracksResult.status === "fulfilled") {
        setTracks(tracksResult.value);
      }

      const sections: LibrarySection[] = [
        "playlists",
        "artists",
        "albums",
        "podcasts",
        "tracks",
      ];
      const nextSectionErrors = results.reduce<LibraryErrors>(
        (errors, result, index) => {
          if (result.status === "rejected") {
            errors[sections[index]] = getErrorMessage(result.reason);
          }
          return errors;
        },
        {},
      );

      setSectionErrors(nextSectionErrors);

      if (results.every((result) => result.status === "rejected")) {
        throw new Error("Failed to load library");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load library",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    playlists,
    artists,
    albums,
    podcasts,
    tracks,
    isLoading,
    error,
    sectionErrors,
    loadLibrary,
    createPlaylist,
  };
};
