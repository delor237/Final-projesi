#!/usr/bin/env -S deno run -A --unstable-kv --watch=static/,routes/

import config from "./fresh.config.ts";

const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
if (!isDenoDeploy) {
  try {
    await import("$std/dotenv/load.ts");
  } catch (_e) {
    // Ignore error if .env is missing during build
  }
}

Deno.env.set("FRESH_NO_UPDATE_CHECK", "true");

const { default: dev } = await import("$fresh/dev.ts");

await dev(import.meta.url, "./main.ts", config);
