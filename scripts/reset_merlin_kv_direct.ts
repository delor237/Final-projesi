// Open the server KV directly by absolute path and update merlin password
import { generateSalt, hashPassword } from "../utils/auth.ts";

const kvPath = "C:/Users/HP/OneDrive/Desktop/project/Final-projesi/kv.db";
console.log("Opening KV at", kvPath);
const kv = await Deno.openKv(kvPath);

const username = "merlin";
const password = "merlin123";

const idRes = await kv.get(["users_by_username", username]);
console.log("users_by_username ->", idRes);
if (!idRes.value) {
  console.error("User not found in kv at path", kvPath);
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
console.log("Updated user in kv:", userId);

Deno.exit(0);
