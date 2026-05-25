#!/usr/bin/env -S deno run -A --unstable-kv --watch=static/,routes/

import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";

Deno.env.set("FRESH_NO_UPDATE_CHECK", "true");

const { default: dev } = await import("$fresh/dev.ts");

await dev(import.meta.url, "./main.ts", config);
