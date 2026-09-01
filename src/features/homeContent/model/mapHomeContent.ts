import type {
  SpotifySearchAlbum,
  SpotifySearchArtist,
  SpotifySearchPlaylist,
  SpotifySearchShow,
} from "../api/types";

export type HomeCardItem = {
  id: string;
  name: string;
  type: "playlist" | "artist" | "show" | "album";
  imageUrl: string | null;
  description: string;
  spotifyUrl: string;
  to: string;
};

export const mapAlbumToHomeCard = (
  album: SpotifySearchAlbum,
): HomeCardItem => ({
  id: album.id,
  name: album.name,
  type: "album",
  imageUrl: album.images[0]?.url ?? null,
  description: album.artists.map((artist) => artist.name).join(", ") || "Album",
  spotifyUrl: album.external_urls.spotify,
  to: `/albums/${album.id}`,
});

export const mapArtistToHomeCard = (
  artist: SpotifySearchArtist,
): HomeCardItem => ({
  id: artist.id,
  name: artist.name,
  type: "artist",
  imageUrl: artist.images[0]?.url ?? null,
  description: artist.genres?.slice(0, 2).join(", ") || "Artist",
  spotifyUrl: artist.external_urls.spotify,
  to: `/artists/${artist.id}`,
});

export const mapPlaylistToHomeCard = (
  playlist: SpotifySearchPlaylist,
): HomeCardItem => ({
  id: playlist.id,
  name: playlist.name,
  type: "playlist",
  imageUrl: playlist.images?.[0]?.url ?? null,
  description:
    playlist.description || playlist.owner?.display_name || "Playlist",
  spotifyUrl: playlist.external_urls.spotify,
  to: `/playlists/${playlist.id}`,
});

export const mapShowToHomeCard = (show: SpotifySearchShow): HomeCardItem => ({
  id: show.id,
  name: show.name,
  type: "show",
  imageUrl: show.images[0]?.url ?? null,
  description: show.description || "Podcast",
  spotifyUrl: show.external_urls.spotify,
  to: `/podcasts/${show.id}`,
});
