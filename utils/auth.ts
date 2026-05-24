import { kv, User } from "./db.ts";

/**
 * Attempt to dynamically import an Argon2 implementation.
 * Prefer a vendored local shim (in-repo) to avoid network failures in CI,
 * then fall back to the deno.land Argon2 module if available.
 */
async function getArgon2(): Promise<
  null | {
    hash: (p: string) => Promise<string>;
    verify: (h: string, p: string) => Promise<boolean>;
  }
> {
  // Try vendored local shim first
  try {
    const localMod = await import("../vendor/argon2_shim.ts");
    const hash = localMod.hash;
    const verify = localMod.verify;
    if (typeof hash === "function" && typeof verify === "function") {
      return { hash: hash.bind(localMod), verify: verify.bind(localMod) };
    }
  } catch {
    // ignore and try remote import
  }

  // Fallback: try remote Argon2 module from deno.land
  try {
    type Argon2Like = {
      hash?: (p: string) => Promise<string>;
      verify?: (h: string, p: string) => Promise<boolean>;
      default?: Argon2Like;
    };

    const mod = await import(
      "https://deno.land/x/argon2@0.6.2/mod.ts"
    ) as unknown as Argon2Like;
    const hash = mod.hash ?? mod.default?.hash;
    const verify = mod.verify ?? mod.default?.verify;
    if (typeof hash === "function" && typeof verify === "function") {
      return { hash: hash.bind(mod), verify: verify.bind(mod) };
    }
    return null;
  } catch {
    console.warn(
      "Argon2 module not available, falling back to legacy SHA-256 hashing.",
    );
    return null;
  }
}

/**
 * Legacy SHA-256 hashing (kept for migration/verification of old users).
 */
export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Rastgele bir tuz (salt) oluşturur.
 */
export function generateSalt(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/**
 * Yeni bir oturum (session) oluşturur ve Deno KV'de saklar.
 */
export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  // Oturum süresi: 7 Gün
  const expireIn = 1000 * 60 * 60 * 24 * 7;
  await kv.set(["sessions", sessionId], userId, { expireIn });
  return sessionId;
}

/**
 * Session ID'ye göre kullanıcıyı Deno KV'den getirir.
 */
export async function getUserBySession(
  sessionId: string,
): Promise<User | null> {
  const sessionRes = await kv.get<string>(["sessions", sessionId]);
  const userId = sessionRes.value;

  if (!userId) return null; // Oturum bulunamadı veya süresi doldu

  const userRes = await kv.get<User>(["users", userId]);
  return userRes.value;
}

/**
 * Yeni bir kullanıcı kaydeder. Artık Argon2 ile hash'lenmiş parolalar kaydedilir.
 */
export async function registerUser(
  username: string,
  password: string,
): Promise<User | null> {
  const usernameKey = ["users_by_username", username];
  const existingRes = await kv.get(usernameKey);

  // Kullanıcı adı zaten alınmışsa null dön
  if (existingRes.value) return null;

  // Try to use Argon2 when available; otherwise fall back to legacy SHA-256.
  const argon2 = await getArgon2();
  let passwordHash: string;
  let salt = "";

  if (argon2) {
    passwordHash = await argon2.hash(password);
  } else {
    salt = generateSalt();
    passwordHash = await hashPassword(password, salt);
  }

  const id = crypto.randomUUID();
  const user: User = {
    id,
    username,
    passwordHash,
    salt,
    createdAt: Date.now(),
  };

  const op = kv.atomic();
  op.check(existingRes); // Username'in biz işlem yaparken alınmadığını doğrula
  op.set(["users", id], user);
  op.set(usernameKey, id);

  const res = await op.commit();
  return res.ok ? user : null;
}

/**
 * Kullanıcı kimlik doğrulamasını (Login) gerçekleştirir.
 * - Eğer kullanıcı zaten Argon2 ile hash'lenmişse Argon2 doğrulaması yapılır.
 * - Aksi halde legacy SHA-256 doğrulaması yapılır; başarılı olursa parola Argon2'ye
 *   dönüştürülerek veritabanı güncellenir (migrasyon).
 */
export async function authenticateUser(
  username: string,
  password: string,
): Promise<User | null> {
  const userIdRes = await kv.get<string>(["users_by_username", username]);
  if (!userIdRes.value) return null; // Kullanıcı bulunamadı

  const userRes = await kv.get<User>(["users", userIdRes.value]);
  if (!userRes.value) return null;

  const user = userRes.value;
  // If the stored hash looks like Argon2, try to verify with Argon2 (if available).
  if (user.passwordHash && user.passwordHash.startsWith("$argon2")) {
    const argon2 = await getArgon2();
    if (!argon2) {
      console.warn("Argon2 verification required but module unavailable.");
      return null;
    }
    try {
      const ok = await argon2.verify(user.passwordHash, password);
      return ok ? user : null;
    } catch {
      return null;
    }
  }

  // Legacy SHA-256 verification for older users
  const hashToVerify = await hashPassword(password, user.salt);
  if (user.passwordHash !== hashToVerify) return null;

  // On successful legacy auth, attempt migration to Argon2 (if available).
  try {
    const argon2 = await getArgon2();
    if (argon2) {
      const newHash = await argon2.hash(password);
      const migratedUser: User = { ...user, passwordHash: newHash, salt: "" };
      await kv.set(["users", migratedUser.id], migratedUser);
      return migratedUser;
    }
    // Argon2 not available; return legacy user as-is
    return user;
  } catch {
    return user;
  }
}

/**
 * Oturumu sonlandırır (Logout) ve Deno KV'den siler.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await kv.delete(["sessions", sessionId]);
}
