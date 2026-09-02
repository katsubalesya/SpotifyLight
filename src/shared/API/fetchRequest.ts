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

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const errorBody = await response
      .clone()
      .json()
      .catch(() => null);
    const isQuotaExceeded = errorBody?.error?.reason === "QUOTA_EXCEEDED";

    if (isQuotaExceeded) {
      throw new Error(
        "Spotify development quota has been exceeded. Try again later.",
      );
    }

    throw new Error(
      retryAfter
        ? `Too many Spotify requests. Try again in ${retryAfter} seconds.`
        : "Too many Spotify requests. Try again later.",
    );
  }

  if (!response.ok) {
    const errorBody = await response
      .clone()
      .json()
      .catch(() => null);
    const spotifyMessage = errorBody?.error?.message;

    if (response.status === 403) {
      throw new Error(
        spotifyMessage
          ? `Spotify API: ${spotifyMessage}. Sign out and authorize the app again.`
          : "Spotify denied access. Sign out and authorize the app again.",
      );
    }

    throw new Error(
      spotifyMessage
        ? `Spotify API error ${response.status}: ${spotifyMessage}`
        : `Spotify API error: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }
  const body = await response.text();

if (!body) {
  return undefined as T;
}

return JSON.parse(body) as T;

  // return response.json() as Promise<T>;
};
