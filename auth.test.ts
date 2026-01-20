import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, getBearerToken } from "./src/auth.js";
import { hashPassword, checkPasswordHash } from "./src/auth.js";


describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});


describe("Bearer Token Extraction", () => {
  it("should extract the Bearer token from a valid Authorization header", () => {
    const mockRequest = {
      headers: {
        get: (key: string) => {
          if (key === "Authorization") {
            return "Bearer someToken123";
          }
          return null;
        },
      },
    };

    const token = getBearerToken(mockRequest as any);
    expect(token).toBe("someToken123");
  });

  it("should throw an error if the Authorization header is missing", () => {
    const mockRequest = {
      headers: {
        get: (key: string) => null,
      },
    };

    expect(() => getBearerToken(mockRequest as any)).toThrow(
      "Missing Authorization header"
    );
  });

  it("should throw an error if the Authorization header is invalid", () => {
    const mockRequest = {
      headers: {
        get: (key: string) => "InvalidHeader",
      },
    };

    expect(() => getBearerToken(mockRequest as any)).toThrow(
      "Invalid Authorization header format"
    );
  });
});