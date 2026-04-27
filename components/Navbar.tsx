import ThemeToggle from "../islands/ThemeToggle.tsx";
import { User } from "../utils/db.ts";

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
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
            {user ? (
              <>
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  Merhaba, <strong>{user.username}</strong>
                </span>
                <a href="/logout" class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
                  Çıkış Yap
                </a>
              </>
            ) : (
              <a href="/login" class="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Giriş Yap
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
