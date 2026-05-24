// Force DENO_KV_PATH to the server's kv.db then import the db helper
Deno.env.set("DENO_KV_PATH", "./kv.db");

import { kv } from "../utils/db.ts";

const username = "merlin";
const idRes = await kv.get(["users_by_username", username]);
console.log("users_by_username ->", idRes);
if (!idRes.value) {
  console.log("User not found");
  Deno.exit(1);
}
const userId = String(idRes.value);
const userRes = await kv.get(["users", userId]);
console.log("user record ->", userRes);
console.log("user value ->", userRes.value);

Deno.exit(0);
