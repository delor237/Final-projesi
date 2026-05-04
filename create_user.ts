import { kv, User } from "./utils/db.ts";
import { hashPassword, generateSalt } from "./utils/auth.ts";

async function createAdmin() {
  const username = "merlin";
  const password = "1234";
  
  const id = crypto.randomUUID();
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  
  const user: User = { id, username, passwordHash, salt, createdAt: Date.now() };
  
  await kv.set(["users", id], user);
  await kv.set(["users_by_username", username], id);
  
  console.log(`User created: ${username} / ${password}`);
  Deno.exit(0);
}

createAdmin();
