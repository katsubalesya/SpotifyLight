import { SCOPES_FOR_API } from "../../app/Consts/Scope";
import {
  ACCESS_TOKEN_KEY,
  CODE_VERIFIER_KEY,
  REFRESH_TOKEN_KEY,
  SPOTIFY_AUTH_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_TOKEN_URL,
} from "../../app/Consts/Spotify";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce";

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

const usedAuthCodes = new Set<string>();

export function getAccessToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token || token === "undefined") {
    if (token === "undefined") localStorage.removeItem(ACCESS_TOKEN_KEY);
    return null;
  }
  return token;
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CODE_VERIFIER_KEY);
}

function saveTokens(data: SpotifyTokenResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
}

/** Step 1: create PKCE pair and redirect to Spotify authorize. */
export async function redirectToSpotifyAuth(): Promise<void> {
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
  });

  window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

/** Step 2: exchange authorization code + code_verifier for tokens (no client_secret). */
export async function exchangeCodeForToken(
  code: string,
): Promise<SpotifyTokenResponse> {
  if (usedAuthCodes.has(code)) {
    throw new Error("Authorization code already used");
  }
  usedAuthCodes.add(code);

  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);
  if (!codeVerifier) {
    usedAuthCodes.delete(code);
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
    usedAuthCodes.delete(code);
    throw new Error(
      data.error_description || data.error || "Token exchange failed",
    );
  }

  localStorage.removeItem(CODE_VERIFIER_KEY);
  saveTokens(data as SpotifyTokenResponse);
  return data as SpotifyTokenResponse;
}

/** Optional: refresh access token with stored refresh_token. */
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
