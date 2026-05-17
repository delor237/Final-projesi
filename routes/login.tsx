import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { hashPassword, authenticateUser, registerUser, createSession } from "../utils/auth.ts";
import { kv } from "../utils/db.ts";
import { State } from "./_middleware.ts";

interface Data {
  error?: string;
  success?: string;
}

export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    if (ctx.state.user) {
      return new Response("", {
        status: 303,
        headers: { Location: "/" },
      });
    }
    return ctx.render({});
  },
  
  async POST(req, ctx) {
    const form = await req.formData();
    const action = form.get("action")?.toString();
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();
    const csrfToken = form.get("_csrf")?.toString();

    const cookies = getCookies(req.headers);
    if (!csrfToken || csrfToken !== cookies.csrf_token) {
      return ctx.render({ error: "Güvenlik doğrulaması başarısız (CSRF)." });
    }

    if (!username || !password) {
      return ctx.render({ error: "Lütfen kullanıcı adı ve şifre giriniz." });
    }

    let user = null;

    if (action === "register") {
      user = await registerUser(username, password);
      if (!user) {
        return ctx.render({ error: "Bu kullanıcı adı zaten sistemde kayıtlı." });
      }
    } else {
      const existingUserCheck = await kv.get(["users_by_username", username]);
      if (!existingUserCheck.value) {
        return ctx.render({ error: "Kullanıcı bulunamadı. Lütfen önce 'Kayıt Ol' butonuna tıklayın." });
      }

      user = await authenticateUser(username, password);
      if (!user) {
        return ctx.render({ error: "Şifre hatalı." });
      }
    }

    const sessionId = await createSession(user.id);
    const headers = new Headers();
    const isSecure = new URL(req.url).protocol === "https:";
    
    setCookie(headers, {
      name: "auth",
      value: sessionId,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "Lax",
      path: "/",
      httpOnly: true,
      secure: isSecure,
    });
    
    headers.set("Location", "/");

    return new Response("", {
      status: 303,
      headers,
    });
  },
};

export default function Login({ data, state }: PageProps<Data, State>) {
  return (
    <div class="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in-up">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/20">
            ✓
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
          Hesabınıza Giriş Yapın
        </h2>
        <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
          Ya da saniyeler içinde yeni bir hesap oluşturun.
        </p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white dark:bg-gray-800 py-10 px-8 shadow-2xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl border border-gray-100 dark:border-gray-800">
          
          {data?.error && (
            <div class="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center gap-3">
              <span class="text-red-500 text-xl font-bold">!</span>
              <p class="text-sm text-red-700 dark:text-red-400 font-medium">{data.error}</p>
            </div>
          )}

          <form method="POST" class="space-y-6">
            <input type="hidden" name="_csrf" value={state.csrfToken} />
            <div>
              <label for="username" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                class="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
                placeholder="merlin"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                class="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <div class="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                name="action"
                value="login"
                class="w-full flex justify-center py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Giriş Yap
              </button>
              
              <button
                type="submit"
                name="action"
                value="register"
                class="w-full flex justify-center py-3.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                Hesap Oluştur
              </button>
            </div>
          </form>
        </div>
        
        <p class="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
          Deno Fresh • Preact • Deno KV
        </p>
      </div>
    </div>
  );
}
