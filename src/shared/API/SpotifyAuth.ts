import { SCOPES_FOR_API } from "../../app/Consts/Scope";
import {
  ACCESS_TOKEN_KEY,
  CODE_VERIFIER_KEY,
  REFRESH_TOKEN_KEY,
  SPOTIFY_AUTH_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_TOKEN_URL,
  TOKEN_EXPIRES_AT_KEY,
} from "../../app/Consts/Spotify";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce";

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

const pendingExchanges = new Map<string, Promise<SpotifyTokenResponse>>();

export function getAccessToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token || token === "undefined") {
    if (token === "undefined") localStorage.removeItem(ACCESS_TOKEN_KEY);
    return null;
  }
  return token;
}

export function isUserAuthenticated(): boolean {
  return Boolean(getAccessToken() && localStorage.getItem(REFRESH_TOKEN_KEY));
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CODE_VERIFIER_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
}

function saveTokens(data: SpotifyTokenResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  localStorage.setItem(
    TOKEN_EXPIRES_AT_KEY,
    String(Date.now() + data.expires_in * 1000),
  );
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
}

function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  if (!expiresAt) return false;
  return Date.now() >= Number(expiresAt) - 60_000;
}

/** Step 1: create PKCE pair and redirect to Spotify authorize. */
export async function redirectToSpotifyAuth(): Promise<void> {
  clearTokens();

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SCOPES_FOR_API.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    show_dialog: "true",
  });

  window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

/** Step 2: exchange authorization code + code_verifier for tokens (no client_secret). */
export async function exchangeCodeForToken(
  code: string,
): Promise<SpotifyTokenResponse> {
  const pending = pendingExchanges.get(code);
  if (pending) {
    return pending;
  }

  const exchangePromise = (async () => {
    const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);
    if (!codeVerifier) {
      throw new Error("Missing code_verifier. Start sign-in again.");
    }

    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(
        data.error_description || data.error || "Token exchange failed",
      );
    }

    if (!data.refresh_token) {
      throw new Error("Invalid token response. Re-authenticate with Spotify.");
    }

    localStorage.removeItem(CODE_VERIFIER_KEY);
    saveTokens(data as SpotifyTokenResponse);
    return data as SpotifyTokenResponse;
  })();

  pendingExchanges.set(code, exchangePromise);

  try {
    return await exchangePromise;
  } catch (error) {
    pendingExchanges.delete(code);
    throw error;
  }
}

/** Refresh access token with stored refresh_token. */
export async function refreshAccessToken(): Promise<SpotifyTokenResponse> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error("No refresh_token");
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Refresh failed");
  }

  saveTokens(data as SpotifyTokenResponse);
  return data as SpotifyTokenResponse;
}

/** Returns a valid access token, refreshing it when expired. */
export async function getValidAccessToken(): Promise<string> {
  if (!isUserAuthenticated()) {
    throw new Error("Not authenticated");
  }

  if (isTokenExpired()) {
    await refreshAccessToken();
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  return token;
}
