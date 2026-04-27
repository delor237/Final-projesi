import ThemeToggle from "../islands/ThemeToggle.tsx";

export default function Navbar() {
  return (
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-xl font-bold text-brand-600 dark:text-brand-500">
              ✓ TodoApp
            </a>
          </div>
          <div class="flex items-center space-x-4">
            <a href="/login" class="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Giriş Yap
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
