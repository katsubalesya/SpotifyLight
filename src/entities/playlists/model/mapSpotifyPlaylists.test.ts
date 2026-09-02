import { describe, expect, it } from "vitest";
import type { SpotifyPlaylist } from "../api/types";
import { mapSpotifyPlaylists } from "./mapSpotifyPlaylists";

describe("mapSpotifyPlaylists", () => {
  it("converts a Spotify playlist into an app model", () => {
    const spotifyPlaylist = {
      id: "playlist-1",
      name: "My playlist",
      owner: {
        display_name: "Alesya",
      },
      external_urls: {
        spotify: "https://open.spotify.com/playlist/playlist-1",
      },
      images: [
        {
          url: "https://example.com/cover.jpg",
          width: 300,
          height: 300,
        },
      ],
    } as SpotifyPlaylist;

    const result = mapSpotifyPlaylists([spotifyPlaylist]);

    expect(result).toEqual([
      {
        id: "playlist-1",
        name: "My playlist",
        ownerName: "Alesya",
        externalUrl: "https://open.spotify.com/playlist/playlist-1",
        mainImage: "https://example.com/cover.jpg",
      },
    ]);
  });

  it("uses Unknown owner if the owner is absent", () => {
    const playlist = {
      collaborative: false,
      type: "playlist",
      id: "playlist-1",
      name: "My playlist",
      owner: null,
    external_urls: {
      spotify: "https://open.spotify.com/playlist/playlist-1",
    },
    description: null,
    images: [
      {
        url: "https://example.com/cover.jpg",
        width: 300,
        height: 300,
      },
    ],
      href: "https://api.spotify.com/v1/playlists/playlist-1",
      public: true,
      snapshot_id: "snapshot-1",
      uri: "spotify:playlist:playlist-1",
    } satisfies SpotifyPlaylist;

    const [result] = mapSpotifyPlaylists([playlist]);

    expect(result.ownerName).toBe("Unknown owner");
  });

  it("returns NULL if the playlist has no image", () => {
    const playlist = {
      id: "playlist-1",
      name: "Playlist",
      owner: null,
      external_urls: {
        spotify: "https://example.com/playlist",
      },
      images: null,
    } as SpotifyPlaylist;

    const [result] = mapSpotifyPlaylists([playlist]);

    expect(result.mainImage).toBeNull();
  });
});
