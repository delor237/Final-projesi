import { registerUser } from "./utils/auth.ts";

async function createAdmin() {
  const username = Deno.env.get("ADMIN_USERNAME");
  const password = Deno.env.get("ADMIN_PASSWORD");

  if (!username || !password) {
    console.error("ADMIN_USERNAME and ADMIN_PASSWORD must be set.");
    Deno.exit(1);
  }

  const user = await registerUser(username, password);
  if (!user) {
    console.error("User already exists.");
    Deno.exit(1);
  }

  console.log(`User created: ${user.username}`);
  Deno.exit(0);
}

createAdmin();
