import { PageProps } from "$fresh/server.ts";

export default function ErrorPage({ error }: PageProps) {
  return (
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="text-9xl font-bold text-red-600 dark:text-red-500 mb-4">500</div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Sistemsel Bir Hata Oluştu
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Şu anda isteğinizi gerçekleştiremiyoruz. Lütfen daha sonra tekrar deneyiniz.
      </p>
      {error && (
        <pre class="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left text-sm overflow-auto max-w-full text-red-600 dark:text-red-400">
          {(error as Error).message}
        </pre>
      )}
      <a
        href="/"
        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors"
      >
        Anasayfaya Dön
      </a>
    </div>
  );
}
