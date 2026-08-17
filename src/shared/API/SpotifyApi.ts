import { SPOTIFY_API_BASE } from "../../app/Consts/Spotify";
import {
  clearTokens,
  getValidAccessToken,
  refreshAccessToken,
} from "./SpotifyAuth";

type SpotifyErrorBody = {
  error?: {
    status?: number;
    message?: string;
  };
};

async function parseSpotifyError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as SpotifyErrorBody;
    return body.error?.message || response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function spotifyFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const request = async (token: string) =>
    fetch(`${SPOTIFY_API_BASE}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  let token = await getValidAccessToken();
  let response = await request(token);

  if (response.status === 401) {
    await refreshAccessToken();
    token = await getValidAccessToken();
    response = await request(token);
  }

  if (!response.ok) {
    const message = await parseSpotifyError(response);

    if (response.status === 403) {
      throw new Error(
        `${message}. If your app is in Development Mode, add this Spotify account in Developer Dashboard → User Management.`,
      );
    }

    throw new Error(message || `Spotify API error (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function logout(): void {
  clearTokens();
  window.location.href = "/login";
}
