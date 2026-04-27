import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { hashPassword, authenticateUser, registerUser, createSession } from "../utils/auth.ts";
import { State } from "./_middleware.ts";

interface Data {
  error?: string;
  success?: string;
}

export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    // Kullanıcı zaten oturum açmışsa direkt dashboard'a yönlendir
    if (ctx.state.user) {
      return new Response("", {
        status: 303,
        headers: { Location: "/dashboard" },
      });
    }
    return ctx.render({});
  },
  
  async POST(req, ctx) {
    const form = await req.formData();
    const action = form.get("action")?.toString(); // "login" veya "register"
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    // Güvenlik: Boş girdi kontrolü
    if (!username || !password) {
      return ctx.render({ error: "Lütfen kullanıcı adı ve şifre giriniz." });
    }

    const hashedPwd = await hashPassword(password);
    let user = null;

    if (action === "register") {
      user = await registerUser(username, hashedPwd);
      if (!user) {
        return ctx.render({ error: "Bu kullanıcı adı zaten sistemde kayıtlı." });
      }
    } else {
      user = await authenticateUser(username, hashedPwd);
      if (!user) {
        return ctx.render({ error: "Kullanıcı adı veya şifre hatalı." });
      }
    }

    // Başarılı giriş / kayıt: Session oluştur ve Cookie'ye kaydet
    const sessionId = await createSession(user.id);
    const headers = new Headers();
    const isSecure = new URL(req.url).protocol === "https:"; // HTTPS zorunluluğu
    
    setCookie(headers, {
      name: "auth",
      value: sessionId,
      maxAge: 60 * 60 * 24 * 7, // 7 Gün
      sameSite: "Lax",
      path: "/",
      httpOnly: true, // XSS koruması için önemli
      secure: isSecure, // Sadece HTTPS üzerinden gönderilmesine izin ver (localhost'ta çalışır)
    });
    
    headers.set("Location", "/dashboard");

    return new Response("", {
      status: 303,
      headers,
    });
  },
};

export default function Login({ data }: PageProps<Data>) {
  return (
    <div class="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sisteme Giriş Yapın
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Veya yeni bir hesap oluşturun
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          
          {data?.error && (
            <div class="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded dark:bg-red-900/30">
              <p class="text-sm text-red-700 dark:text-red-400">{data.error}</p>
            </div>
          )}

          <form method="POST" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kullanıcı Adı
              </label>
              <div class="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Kullanıcı adınız"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Şifre
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div class="flex gap-4">
              <button
                type="submit"
                name="action"
                value="login"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Giriş Yap
              </button>
              
              <button
                type="submit"
                name="action"
                value="register"
                class="w-full flex justify-center py-2 px-4 border border-brand-600 dark:border-brand-500 rounded-md shadow-sm text-sm font-medium text-brand-600 dark:text-brand-400 bg-transparent hover:bg-brand-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Kayıt Ol
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
