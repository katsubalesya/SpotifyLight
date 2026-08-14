import { useState } from "react";
import { useAccessToken } from "./UseAccessToken";

interface IPlaylist {
    collaborative: boolean;
    description: string;
    external_urls: string;
    href: string;
    id: string;
    images: Array<string> | null;
    items: {href: string; total: number};
    name: string;
    owner: {display_name: string};
    primary_color: string | null;
    public: boolean;
    snapshot_id: string;
    tracks: {href: string; total: number}
    type: string;
    uri: string;
}
interface IPlaylistsResponce {
    href: string;
    items: Array<IPlaylist>;
    limit: number;
    next: number | null;
    offset: number | null;
    total: number;
}

export const useLoadPlaylist = () => {
      const [playlists, setPlaylists] = useState <IPlaylist[]>([]);
      const [isLoading, setLoading] = useState(false);

    const token = useAccessToken();

     const loadLibraryContent = async () => {
    // const responce = await fetch(`https://api.spotify.com/v1/me/library/contains?uris=${LIBRARY_URIS.join(',')}`, {
    // const responce = await fetch(`https://api.spotify.com/v1/users/smedjan/playlists`, {
    if (!token) return

    setLoading(true);
    const responce = await fetch(
      `https://api.spotify.com/v1/users/me/playlists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await responce.json();
    setLoading(false);
    setPlaylists(data.items);
    console.log(data);
  };

  return {
    loadLibraryContent, playlists, isLoading
  }
}