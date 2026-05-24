Deno.env.set("DENO_KV_PATH", "./kv.db");
const db = await import("../utils/db.ts");
const kv = db.kv;

console.log("Listing users_by_username entries:");
for await (const r of kv.list({ prefix: ["users_by_username"] })) {
  console.log(r);
}

console.log("\nListing users entries:");
for await (const r of kv.list({ prefix: ["users"] })) {
  console.log(r);
}

Deno.exit(0);
