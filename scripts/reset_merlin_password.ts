// Ensure we target the server KV file
Deno.env.set("DENO_KV_PATH", "./kv.db");
const db = await import("../utils/db.ts");
const { kv } = db;
import { generateSalt, hashPassword } from "../utils/auth.ts";

const username = "merlin";
const password = "merlin123";

console.log(`Looking up user '${username}'`);
const idRes = await kv.get<string>(["users_by_username", username]);
if (!idRes.value) {
  console.log("User not found — creating new user with provided password.");
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const id = crypto.randomUUID();
  const user = { id, username, passwordHash, salt, createdAt: Date.now() };
  const op = kv.atomic();
  op.set(["users", id], user);
  op.set(["users_by_username", username], id);
  const res = await op.commit();
  if (res.ok) console.log("Created user", username);
  else console.error("Failed to create user");
  Deno.exit(res.ok ? 0 : 1);
}

const userId = idRes.value;
const userRes = await kv.get(["users", userId]);
if (!userRes.value) {
  console.error("User record missing for id", userId);
  Deno.exit(1);
}

const newSalt = generateSalt();
const newHash = await hashPassword(password, newSalt);
const updatedUser = { ...userRes.value, passwordHash: newHash, salt: newSalt };
await kv.set(["users", userId], updatedUser);
console.log(
  `Password for user '${username}' has been updated to '${password}'.`,
);
Deno.exit(0);
