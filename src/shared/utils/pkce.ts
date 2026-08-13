/** PKCE helpers for Spotify Authorization Code flow (SPA, no client_secret). */

const VERIFIER_LENGTH = 64

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Random code_verifier: 43–128 characters [A-Z]/a-z]/0-9-._~] */
export function generateCodeVerifier(length = VERIFIER_LENGTH): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = crypto.getRandomValues(new Uint8Array(length))

  return Array.from(values, (x) => possible[x % possible.length]).join('')
}

/** code_challenge = BASE64URL(SHA256(code_verifier)) */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}