import { SPOTIFY_API_BASE } from "../../app/consts/spotify";
import { clearTokens, getAccessToken, refreshAccessToken } from "./spotifyAuth";

export const spotifyFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  let token = getAccessToken();

  if (!token) {
    throw new Error("The user is not authorized");
  }

  const makeRequest = (accessToken: string) => {
    return fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });
  };

  let response = await makeRequest(token);

  if (response.status === 401) {
    try {
      const tokenData = await refreshAccessToken();
      token = tokenData.access_token;
      response = await makeRequest(token);
    } catch {
      clearTokens();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
