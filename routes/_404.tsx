export default function NotFoundPage() {
  return (
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="text-9xl font-bold text-brand-600 dark:text-brand-500 mb-4">404</div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Sayfa Bulunamadı
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <a
        href="/"
        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors"
      >
        Anasayfaya Dön
      </a>
    </div>
  );
}
