import { kv, User } from "./db.ts";

/**
 * Şifreleri güvenli bir şekilde SHA-256 algoritmasıyla ve tuz (salt) ekleyerek hash'ler.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
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
export async function getUserBySession(sessionId: string): Promise<User | null> {
  const sessionRes = await kv.get<string>(["sessions", sessionId]);
  const userId = sessionRes.value;
  
  if (!userId) return null; // Oturum bulunamadı veya süresi doldu
  
  const userRes = await kv.get<User>(["users", userId]);
  return userRes.value;
}

/**
 * Yeni bir kullanıcı kaydeder. Kullanıcı adı benzersiz (unique) olmalıdır.
 */
export async function registerUser(username: string, password: string): Promise<User | null> {
  const usernameKey = ["users_by_username", username];
  const existingRes = await kv.get(usernameKey);
  
  // Kullanıcı adı zaten alınmışsa null dön
  if (existingRes.value) return null;
  
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const id = crypto.randomUUID();
  const user: User = { id, username, passwordHash, salt, createdAt: Date.now() };
  
  const op = kv.atomic();
  op.check(existingRes); // Username'in biz işlem yaparken alınmadığını doğrula
  op.set(["users", id], user);
  op.set(usernameKey, id);
  
  const res = await op.commit();
  return res.ok ? user : null;
}

/**
 * Kullanıcı kimlik doğrulamasını (Login) gerçekleştirir.
 */
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const userIdRes = await kv.get<string>(["users_by_username", username]);
  if (!userIdRes.value) return null; // Kullanıcı bulunamadı
  
  const userRes = await kv.get<User>(["users", userIdRes.value]);
  if (!userRes.value) return null;
  
  const user = userRes.value;
  const hashToVerify = await hashPassword(password, user.salt);
  
  // Şifre hash'leri uyuşmuyorsa null dön
  if (user.passwordHash !== hashToVerify) return null;
  
  return user;
}

/**
 * Oturumu sonlandırır (Logout) ve Deno KV'den siler.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await kv.delete(["sessions", sessionId]);
}
