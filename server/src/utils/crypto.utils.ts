import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from 'crypto';

const ALGORITHM: string = 'aes-256-cbc';

export function encryptToken(secretKey: string, payload: string): string {
  try {
    const key = createHash('sha256').update(secretKey).digest();
    const iv = randomBytes(16); // Generate random IV
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Prepend IV to encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate share token');
  }
}

export function decryptToken(secretKey: string, token: string): string {
  try {
    // Split IV and encrypted data
    const [ivHex, encrypted] = token.split(':');

    if (!ivHex || !encrypted) {
      throw new Error('Invalid token format');
    }

    const key = createHash('sha256').update(secretKey).digest();
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error decrypting token:', error);
    throw new Error('Invalid share token');
  }
}
