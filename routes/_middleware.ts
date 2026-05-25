import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { getUserBySession } from "../utils/auth.ts";
import { User } from "../utils/db.ts";

const rateLimits = new Map<string, { count: number; resetAt: number }>();

const AUTH_LIMIT = { windowMs: 60_000, max: 5 };
const API_WRITE_LIMIT = { windowMs: 60_000, max: 60 };

// Tüm sayfalarda geçerli olacak Global State tipi
export interface State {
  user: User | null;
  csrfToken: string;
}

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
}

function isLimited(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (current.count >= max) return true;

  current.count += 1;
  return false;
}

function shouldRateLimit(req: Request, pathname: string) {
  if (pathname === "/login" && req.method === "POST") return AUTH_LIMIT;
  if (
    pathname.startsWith("/api/") &&
    ["POST", "PATCH", "DELETE"].includes(req.method)
  ) {
    return API_WRITE_LIMIT;
  }
  return null;
}

function addSecurityHeaders(headers: Headers, req: Request) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );

  if (new URL(req.url).protocol === "https:") {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
}

function securedResponse(body: BodyInit, init: ResponseInit, req: Request) {
  const headers = new Headers(init.headers);
  addSecurityHeaders(headers, req);
  return new Response(body, { ...init, headers });
}

/**
 * Middleware: Her istekte çalışır. Kullanıcının oturum açıp açmadığını kontrol eder.
 */
export async function handler(
  req: Request,
  ctx: FreshContext<State>,
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
  const limit = shouldRateLimit(req, url.pathname);
  if (limit) {
    const key = `${clientIp(req)}:${req.method}:${url.pathname}`;
    if (isLimited(key, limit.max, limit.windowMs)) {
      return securedResponse("Too Many Requests", { status: 429 }, req);
    }
  }

  if (url.pathname.startsWith("/api/") && !ctx.state.user) {
    return securedResponse("Unauthorized", { status: 401 }, req);
  }

  const resp = await ctx.next();
  addSecurityHeaders(resp.headers, req);

  // Headers'ları birleştir (CSRF cookie'sini eklemek için)
  resHeaders.forEach((value, key) => {
    resp.headers.append(key, value);
  });

  return resp;
}
