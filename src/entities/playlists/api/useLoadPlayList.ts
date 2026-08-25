// import { useAccessToken } from "../../hooks/useAccessToken";
import { useState } from "react";
import type { LoadPlaylistsResponse, SpotifyPlaylistsResponse } from "./types";
import { spotifyFetch } from "../../../shared/API/fetchRequest";

// import { makeRequest } from "./MakeRequest";

export const useLoadPlaylist = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylistsResponse[]>([]);
  const [isLoading, setLoading] = useState(false);


  const loadLibraryContent = async () => {
   try{ 
    setLoading(true);
    
    const data = await spotifyFetch<LoadPlaylistsResponse>(`/me/playlists`);
    
    setPlaylists(data.items);
  } catch (error)
  {
    console.error('Failed to load playlists:', error);
  } finally {
    setLoading(false);
  }
  }
    
  return {
    loadLibraryContent,
    playlists,
    isLoading,
  };
};
