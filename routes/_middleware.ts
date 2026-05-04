import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { getUserBySession } from "../utils/auth.ts";
import { User } from "../utils/db.ts";

// Tüm sayfalarda geçerli olacak Global State tipi
export interface State {
  user: User | null;
  csrfToken: string;
}

/**
 * Middleware: Her istekte çalışır. Kullanıcının oturum açıp açmadığını kontrol eder.
 */
export async function handler(
  req: Request,
  ctx: FreshContext<State>
) {
  const cookies = getCookies(req.headers);
  const sessionId = cookies.auth;
  
  // CSRF Token Yönetimi
  let csrfToken = cookies.csrf_token;
  const resHeaders = new Headers();
  
  if (!csrfToken) {
    csrfToken = crypto.randomUUID();
    setCookie(resHeaders, {
      name: "csrf_token",
      value: csrfToken,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    });
  }
  
  ctx.state.csrfToken = csrfToken;

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

  const resp = await ctx.next();
  
  // Headers'ları birleştir (CSRF cookie'sini eklemek için)
  resHeaders.forEach((value, key) => {
    resp.headers.append(key, value);
  });
  
  return resp;
}
