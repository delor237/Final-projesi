import { authenticateUser } from "../utils/auth.ts";

const username = Deno.args[0] ?? "merlin";
const password = Deno.args[1] ?? "merlin123";

const user = await authenticateUser(username, password);
if (user) {
  console.log("authenticateUser returned user:", user.username);
  Deno.exit(0);
} else {
  console.log("authenticateUser returned null (auth failed)");
  Deno.exit(1);
}
