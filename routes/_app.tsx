import { type PageProps } from "$fresh/server.ts";
import Navbar from "../islands/Navbar.tsx";
import { State } from "./_middleware.ts";

export default function App({ Component, state }: PageProps<any, State>) {
  return (
    <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Deno Fresh Todo Uygulaması</title>
        {/* Kullanıcının dark tema tercihini sayfa yüklenmeden önce kontrol eden script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            `,
          }}
        />
      </head>
      <body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
        <Navbar user={state?.user} />
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Component />
        </main>
      </body>
    </html>
  );
}
