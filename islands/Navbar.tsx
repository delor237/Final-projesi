import { useState } from "preact/hooks";
import ThemeToggle from "./ThemeToggle.tsx";
import { User } from "../utils/db.ts";

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="flex items-center gap-2 group">
              <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
                ✓
              </div>
              <span class="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300">
                TodoApp
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div class="hidden md:flex items-center space-x-6">
            {user
              ? (
                <>
                  <a
                    href="/categories"
                    class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Kategoriler
                  </a>
                  <div class="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.username}
                    </span>
                  </div>
                  <a
                    href="/logout"
                    class="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                  >
                    Çıkış Yap
                  </a>
                </>
              )
              : (
                <a
                  href="/login"
                  class="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95"
                >
                  Giriş Yap
                </a>
              )}
            <div class="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div class="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen
                  ? (
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )
                  : (
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div
        class={`${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } md:hidden overflow-hidden transition-all duration-300 border-t border-gray-100 dark:border-gray-800`}
      >
        <div class="px-4 py-4 space-y-3">
          {user
            ? (
              <>
                <div class="px-3 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Hesabım: {user.username}
                </div>
                <a
                  href="/categories"
                  class="block px-3 py-2 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600"
                >
                  Kategoriler
                </a>
                <a
                  href="/logout"
                  class="block px-3 py-2 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Çıkış Yap
                </a>
              </>
            )
            : (
              <a
                href="/login"
                class="block px-3 py-2 rounded-xl text-base font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20"
              >
                Giriş Yap
              </a>
            )}
        </div>
      </div>
    </nav>
  );
}
