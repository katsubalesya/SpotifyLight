// describe — объединяет связанные тесты;
// it — один тестовый сценарий;
// expect — проверяет результат;
// beforeEach — запускается перед каждым тестом;
// vi — создаёт подмены и mock-функции.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAccessToken, refreshAccessToken } from "./spotifyAuth";
import { spotifyFetch } from "./fetchRequest";

vi.mock("./spotifyAuth.ts", () => ({
  getAccessToken: vi.fn(),
  refreshAccessToken: vi.fn(),
  clearTokens: vi.fn(),
}));

describe("spotifyFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("After 401, refresh the token and repeat the request", async () => {
    vi.mocked(getAccessToken).mockReturnValue("old-token");

    vi.mocked(refreshAccessToken).mockResolvedValue({
      access_token: "new-token",
      token_type: "Bearer",
      expires_in: 3600,
    });

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(null, {
            status: 401,
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: "user-1" }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ),
    );

    const result = await spotifyFetch<{ id: string }>("/me");

    expect(result).toEqual({ id: "user-1" });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);

    const secondRequestOptions = vi.mocked(fetch).mock.calls[1][1];

    expect(secondRequestOptions?.headers).toMatchObject({
      Authorization: "Bearer new-token",
    });
  });

  it("reports the exhaustion of the DEVELOPMENT QUOTA", async () => {
    vi.mocked(getAccessToken).mockReturnValue("token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              reason: "QUOTA_EXCEEDED",
            },
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    await expect(spotifyFetch("/search")).rejects.toThrow(
      "Spotify development quota has been exceeded",
    );
  });

  it("shows the waiting time from Retry-After", async () => {
    vi.mocked(getAccessToken).mockReturnValue("token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: {} }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "30",
          },
        }),
      ),
    );

    await expect(spotifyFetch("/search")).rejects.toThrow(
      "Too many Spotify requests. Try again in 30 seconds.",
    );
  });

  it("gives a general message if Retry-After is missing", async () => {
    vi.mocked(getAccessToken).mockReturnValue("token");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: {} }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ),
    );
    await expect(spotifyFetch("/search")).rejects.toThrow(
    "Too many Spotify requests. Try again later.",)
  });
});
