import { type PageProps } from "$fresh/server.ts";
import Navbar from "../islands/Navbar.tsx";
import { State } from "./_middleware.ts";

export default function App({ Component, state }: PageProps<unknown, State>) {
  return (
    <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Deno Fresh Todo Uygulaması</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
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
