import crypto from 'crypto';

/**
 * Hash a password using Node's native crypto (PBKDF2).
 * Fast, secure, and doesn't require native binary npm packages.
 * @param {string} password - Raw password to hash
 * @returns {string} The salt and hashed password concatenated by a colon (salt:hash)
 */
export function hashPassword(password) {
  if (!password) throw new Error('Password is required for hashing');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a raw password against an existing hashedPassword.
 * @param {string} password - The raw password to check
 * @param {string} hashedPassword - The stored hashed password (salt:hash)
 * @returns {boolean} True if matching, false otherwise
 */
export function verifyPassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  try {
    const parts = hashedPassword.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHash] = parts;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
