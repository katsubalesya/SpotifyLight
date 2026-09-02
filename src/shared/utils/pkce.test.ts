import { describe, expect, it } from "vitest";
import { generateCodeChallenge, generateCodeVerifier } from "./pkce";

describe("generateCodeVerifier", () => {
  it("creates a 64-character verifier", () => {
    const verifier = generateCodeVerifier();

    expect(verifier).toHaveLength(64);
  });

  it("uses only permitted PKCE characters", () => {
    const verifier = generateCodeVerifier();

    expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/);
  });

  it("supports the specified length", () => {
    const verifier = generateCodeVerifier(100);

    expect(verifier).toHaveLength(100);
  });
});

describe("generateCodeChallenge", () => {
    it("creates SHA-256 code challenge", async () => {
  const verifier =
    "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

  const challenge = await generateCodeChallenge(verifier);

  expect(challenge).toBe(
    "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  );
});
})
