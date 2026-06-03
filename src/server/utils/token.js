const SECRET = process.env.ADMIN_JWT_SECRET || 'bhayeli-premium-admin-secret-key-10293847';

// Standard base64url helpers for full cross-runtime compatibility (Edge, Node, Web)
function base64urlEncode(str) {
  const binary = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
  return globalThis.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = globalThis.atob(base64);
  return decodeURIComponent(binary.split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return globalThis.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function getHmacKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET);
  return await globalThis.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Signs a session payload into a signed base64url token string.
 * Edge Runtime compliant.
 * @param {object} payload - The token data (e.g. { adminId, username })
 * @param {number} expiresInHours - Token lifespan in hours (default: 24h)
 * @returns {Promise<string>} The signed token (payload.signature)
 */
export async function signToken(payload, expiresInHours = 24) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object');
  }
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const data = { ...payload, expiresAt };
  const serialized = base64urlEncode(JSON.stringify(data));
  
  const key = await getHmacKey();
  const encoder = new TextEncoder();
  const signatureBuffer = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(serialized)
  );
  
  const signature = arrayBufferToBase64Url(signatureBuffer);
  return `${serialized}.${signature}`;
}

/**
 * Verifies a token string, checking the signature and session expiry.
 * Edge Runtime compliant.
 * @param {string} token - The raw token string
 * @returns {Promise<object|null>} The decoded payload if valid and unexpired, otherwise null
 */
export async function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [serialized, signature] = parts;
  
  try {
    const key = await getHmacKey();
    const encoder = new TextEncoder();
    
    // Decode signature back to Uint8Array for verification
    const sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
    const sigBinary = globalThis.atob(sigBase64);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }
    
    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(serialized)
    );
    
    if (!isValid) return null;
    
    const decoded = JSON.parse(base64urlDecode(serialized));
    
    // Check if token has expired
    if (Date.now() > decoded.expiresAt) {
      return null; // Expired
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
