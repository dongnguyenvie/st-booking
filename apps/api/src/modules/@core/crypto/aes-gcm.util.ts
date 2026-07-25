/**
 * AES-256-GCM symmetric encryption utility.
 * Key source: process.env.APP_ENCRYPTION_KEY (base64-encoded 32 bytes).
 * Ciphertext format: base64(iv) + ':' + base64(authTag) + ':' + base64(ciphertext)
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const TAG_LENGTH = 16;

let _cachedKey: Buffer | null = null;

function getKey(): Buffer {
  if (_cachedKey) return _cachedKey;

  const raw = process.env.APP_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('APP_ENCRYPTION_KEY is not set. Generate with: openssl rand -base64 32');
  }

  const keyBuffer = Buffer.from(raw, 'base64');
  if (keyBuffer.length !== 32) {
    throw new Error(
      `APP_ENCRYPTION_KEY must decode to exactly 32 bytes (got ${keyBuffer.length}). ` +
        'Generate with: openssl rand -base64 32',
    );
  }

  _cachedKey = keyBuffer;
  return _cachedKey;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * @returns Combined string: base64(iv):base64(authTag):base64(ciphertext)
 */
export function encryptString(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join(':');
}

/**
 * Decrypts a ciphertext string produced by encryptString.
 * @throws Error on tampered/invalid input or wrong key.
 */
export function decryptString(ciphertext: string): string {
  const key = getKey();
  const parts = ciphertext.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid ciphertext format. Expected iv:authTag:ciphertext');
  }

  // parts.length === 3 is guaranteed above; cast to string to satisfy TS strict checks
  const [ivB64, tagB64, ctB64] = parts as [string, string, string];
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(tagB64, 'base64');
  const encrypted = Buffer.from(ctB64, 'base64');

  if (iv.length !== IV_LENGTH) {
    throw new Error('Invalid IV length in ciphertext');
  }

  if (authTag.length !== TAG_LENGTH) {
    throw new Error('Invalid auth tag length in ciphertext');
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(authTag);

  try {
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    throw new Error('Decryption failed: ciphertext may be tampered or key is wrong');
  }
}

/** Clears the cached key — used in tests to reset state between runs. */
export function _resetKeyCache(): void {
  _cachedKey = null;
}
