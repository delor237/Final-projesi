import { Handlers } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import { deleteSession } from "../utils/auth.ts";

export const handler: Handlers = {
  async GET(req) {
    const cookies = getCookies(req.headers);
    const sessionId = cookies.auth;

    if (sessionId) {
      // Veritabanından (Deno KV) oturumu sil
      await deleteSession(sessionId);
    }

    const headers = new Headers();
    // Tarayıcıdan Cookie'yi sil
    deleteCookie(headers, "auth", { path: "/" });
    headers.set("Location", "/");

    return new Response("", {
      status: 303,
      headers,
    });
  },
};
