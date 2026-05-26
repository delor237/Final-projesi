/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
if (!isDenoDeploy) {
  try {
    await import("$std/dotenv/load.ts");
  } catch (_e) {
    // Ignore error if .env is missing during build
  }
}

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

await start(manifest, config);
