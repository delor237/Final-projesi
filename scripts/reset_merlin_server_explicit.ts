// Update merlin password in the server's kv.db explicitly
Deno.env.set("DENO_KV_PATH", "./kv.db");
const db = await import("../utils/db.ts");
const { kv } = db;
import { generateSalt, hashPassword } from "../utils/auth.ts";

const username = "merlin";
const password = "merlin123";

console.log("Looking up user in server kv.db ->", username);
const idRes = await kv.get(["users_by_username", username]);
console.log("idRes ->", idRes);
if (!idRes.value) {
  console.error("User not found in server kv.db");
  Deno.exit(1);
}

const userId = String(idRes.value);
const userRes = await kv.get(["users", userId]);
console.log("before userRes ->", userRes);

const newSalt = generateSalt();
const newHash = await hashPassword(password, newSalt);
const userVal = (userRes.value ?? {}) as Record<string, unknown>;
const updatedUser = { ...userVal, passwordHash: newHash, salt: newSalt };
await kv.set(["users", userId], updatedUser);
console.log(`Updated user ${username} (${userId}) with new password.`);

Deno.exit(0);
