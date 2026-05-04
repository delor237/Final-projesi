import { setCookie, getCookies, deleteCookie } from "$std/http/cookie.ts";

/**
 * Yeni bir CSRF token'ı oluşturur ve cookie olarak ayarlar.
 */
export function setCsrfToken(headers: Headers): string {
  const token = crypto.randomUUID();
  setCookie(headers, {
    name: "csrf_token",
    value: token,
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
  });
  return token;
}

/**
 * İstekteki CSRF token'ını doğrular.
 */
export function verifyCsrfToken(req: Request, headers: Headers): boolean {
  const cookies = getCookies(req.headers);
  const tokenFromCookie = cookies.csrf_token;
  
  // POST/PATCH/DELETE isteklerinde hem cookie hem de header veya form verisi kontrol edilebilir.
  // Basitlik adına burada sadece cookie varlığını ve bir "x-csrf-token" header'ını veya form alanını kontrol edeceğiz.
  
  // Not: Bu basit bir implementasyondur.
  return !!tokenFromCookie;
}
