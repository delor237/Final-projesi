export default function Home() {
  return (
    <div class="flex flex-col items-center justify-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Deno Fresh Todo Uygulaması
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-center">
        Bu proje, modern web teknolojileri kullanılarak geliştirilmiş bir görev yönetim sistemidir. 
        Giriş yaparak görevlerinizi yönetmeye başlayabilirsiniz.
      </p>
      
      <div class="mt-8">
        <a 
          href="/login" 
          class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors"
        >
          Sisteme Giriş Yap
        </a>
      </div>
    </div>
  );
}
