import { describe, expect, it } from "vitest";
import { decrypt, encrypt, maskApiKey } from "./crypto";

const TEST_KEY = "a".repeat(32);

describe("encrypt/decrypt", () => {
 it("round-trips a string", () => {
  const plaintext = "my-secret-api-key";
  const ciphertext = encrypt(plaintext, TEST_KEY);
  const decrypted = decrypt(ciphertext, TEST_KEY);
  expect(decrypted).toBe(plaintext);
 });

 it("produces different ciphertext each time (random IV)", () => {
  const plaintext = "same-input";
  const a = encrypt(plaintext, TEST_KEY);
  const b = encrypt(plaintext, TEST_KEY);
  expect(a).not.toBe(b);
 });

 it("fails with wrong key", () => {
  const plaintext = "secret";
  const ciphertext = encrypt(plaintext, TEST_KEY);
  const wrongKey = "b".repeat(32);
  expect(() => decrypt(ciphertext, wrongKey)).toThrow();
 });

 it("rejects key shorter than 32 bytes", () => {
  expect(() => encrypt("data", "short")).toThrow("at least 32 bytes");
 });
});

describe("maskApiKey", () => {
 it("masks middle of key", () => {
  expect(maskApiKey("ABCDEFGHIJKL")).toBe("ABCD****IJKL");
 });

 it("handles short keys", () => {
  expect(maskApiKey("ABC")).toBe("****");
 });
});
