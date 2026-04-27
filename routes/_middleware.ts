import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getUserBySession } from "../utils/auth.ts";
import { User } from "../utils/db.ts";

// Tüm sayfalarda geçerli olacak Global State tipi
export interface State {
  user: User | null;
}

/**
 * Middleware: Her istekte çalışır. Kullanıcının oturum açıp açmadığını kontrol eder.
 * Güvenlik Kuralı: İstemcideki auth cookie'sini sunucu tarafında doğrular.
 */
export async function handler(
  req: Request,
  ctx: FreshContext<State>
) {
  const cookies = getCookies(req.headers);
  const sessionId = cookies.auth;

  if (sessionId) {
    const user = await getUserBySession(sessionId);
    ctx.state.user = user || null;
  } else {
    ctx.state.user = null;
  }

  // Korumalı route kontrolü: Kullanıcı giriş yapmamışsa anasayfaya/dashboard'a girmesini engelle
  const url = new URL(req.url);
  const protectedRoutes = ["/dashboard", "/todos"];
  
  if (protectedRoutes.some((route) => url.pathname.startsWith(route)) && !ctx.state.user) {
    return new Response("", {
      status: 303,
      headers: { Location: "/login" },
    });
  }

  return await ctx.next();
}
