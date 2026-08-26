import { useCallback, useState } from "react";

import type { Playlist } from "../../playlists/model/types";
import type { Artist } from "../../artist/model/types";
import type { Album } from "../../album/model/types";
import type { IPodcast } from "../../podcast/model/types";
import type { IRecentTrack } from "../../track/model/types";

import { getFollowedArtists } from "../../artist/api/getFollowedArtists";
import { getSavedAlbums } from "../../album/api/getSavedAlbums";
import { getSavedPodcasts } from "../../podcast/api/getSavedPodcasts";
import { getRecentlyPlayed } from "../../track/api/getRecentPlayed";
// import { getLibraryPlaylists } from "../../playlists/model/mapSpotifyPlaylists";

import { spotifyFetch } from "../../../shared/API/fetchRequest";
import type { SpotifyPlaylistsResponse } from "../../playlists/api/types";
import { mapSpotifyPlaylists } from "../../playlists/model/mapSpotifyPlaylists";
import { useAccessToken } from "../../hooks/useAccessToken";
import { createPlaylist as createPlaylistRequest } from "../../playlists/api/createPlaylist";

export const useLibrary = () => {
  const token = useAccessToken();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [podcasts, setPodcasts] = useState<IPodcast[]>([]);
  const [tracks, setTracks] = useState<IRecentTrack[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const playlistsPromise = spotifyFetch<{
        items: SpotifyPlaylistsResponse[];
      }>(`/me/playlists?limit=50`).then((data) =>
        mapSpotifyPlaylists(data.items),
      );

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
    loadLibrary,
    createPlaylist,
  };
};
