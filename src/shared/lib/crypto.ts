import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getKeyBuffer(key: string): Buffer {
 const buf = Buffer.from(key, "utf-8");
 if (buf.length < 32) {
  throw new Error("APP_ENCRYPTION_KEY must be at least 32 bytes");
 }
 return buf.subarray(0, 32);
}

export function encrypt(plaintext: string, encryptionKey: string): string {
 const key = getKeyBuffer(encryptionKey);
 const iv = randomBytes(IV_LENGTH);
 const cipher = createCipheriv(ALGORITHM, key, iv);

 const encrypted = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
 const tag = cipher.getAuthTag();

 return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(ciphertext: string, encryptionKey: string): string {
 const key = getKeyBuffer(encryptionKey);
 const data = Buffer.from(ciphertext, "base64");

 const iv = data.subarray(0, IV_LENGTH);
 const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
 const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);

 const decipher = createDecipheriv(ALGORITHM, key, iv);
 decipher.setAuthTag(tag);

 return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf-8");
}

export function maskApiKey(apiKey: string): string {
 if (apiKey.length <= 8) return "****";
 return `${apiKey.slice(0, 4)}****${apiKey.slice(-4)}`;
}
