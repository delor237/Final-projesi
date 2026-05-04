import { useState } from "preact/hooks";
import ThemeToggle from "./ThemeToggle.tsx";
import { User } from "../utils/db.ts";

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-xl font-bold text-brand-600 dark:text-brand-500">
              ✓ TodoApp
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div class="hidden md:flex items-center space-x-4">
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

          {/* Mobile Menu Button */}
          <div class="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span class="sr-only">Menüyü aç</span>
              <svg
                class={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                class={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div class={`${isOpen ? "block" : "hidden"} md:hidden border-t border-gray-200 dark:border-gray-700`}>
        <div class="px-4 pt-2 pb-3 space-y-1 sm:px-3">
          {user ? (
            <div class="flex flex-col space-y-2">
              <span class="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300">
                Merhaba, {user.username}
              </span>
              <a
                href="/logout"
                class="block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Çıkış Yap
              </a>
            </div>
          ) : (
            <a
              href="/login"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Giriş Yap
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
