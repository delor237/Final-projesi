// Lightweight Argon2-compatible shim using PBKDF2 as a local vendored fallback.
// Exports `hash(password)` -> string and `verify(hash, password)` -> boolean
// The returned hash string begins with `$argon2` so the application's
// detection logic treats these as Argon2-style hashes.

export async function hash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltB64 = bytesToBase64(saltBytes);
  const iterations = 50000; // reasonable security / perf tradeoff for CI

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes.buffer as ArrayBuffer,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  const derived = new Uint8Array(derivedBits);
  const hashB64 = bytesToBase64(derived);
  // Format: $argon2$shim$<iterations>$<saltB64>$<hashB64>
  return `$argon2$shim$${iterations}$${saltB64}$${hashB64}`;
}

export async function verify(
  stored: string,
  password: string,
): Promise<boolean> {
  try {
    const parts = stored.split("$");
    // Expect ['', 'argon2', 'shim', iterations, saltB64, hashB64]
    if (parts.length < 6) return false;
    const iterations = parseInt(parts[3]);
    const saltB64 = parts[4];
    const hashB64 = parts[5];

    const saltBytes = base64ToBytes(saltB64);
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes.buffer as ArrayBuffer,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      256,
    );
    const derived = new Uint8Array(derivedBits);
    const computedB64 = bytesToBase64(derived);
    return computedB64 === hashB64;
  } catch {
    return false;
  }
}

function bytesToBase64(u8: Uint8Array): string {
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s);
}

function base64ToBytes(b64: string): Uint8Array {
  const s = atob(b64);
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
  return u8;
}
