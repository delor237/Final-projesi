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

  // /api/ rotalarına yetkisiz erişimi engelle
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/") && !ctx.state.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return await ctx.next();
}
