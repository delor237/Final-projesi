import { hashPassword } from "../utils/auth.ts";

const [password, salt] = Deno.args;
if (!password || !salt) {
  console.error("Usage: deno run compute_hash.ts <password> <salt>");
  Deno.exit(1);
}

const h = await hashPassword(password, salt);
console.log(h);
