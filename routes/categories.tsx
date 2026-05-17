import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import Navbar from "../islands/Navbar.tsx";
import CategoryManager from "../islands/CategoryManager.tsx";
import { getCategoriesByUser, getTodosByUser } from "../utils/db.ts";

export const handler: Handlers<any, State> = {
  async GET(req, ctx) {
    if (!ctx.state.user) {
      return new Response("", { status: 303, headers: { Location: "/login" } });
    }

    const categories = await getCategoriesByUser(ctx.state.user.id);
    const todos = await getTodosByUser(ctx.state.user.id);

    const todosCountMap: Record<string, number> = {};
    for (const todo of todos) {
      if (todo.categoryId) {
        todosCountMap[todo.categoryId] = (todosCountMap[todo.categoryId] || 0) + 1;
      }
    }

    return ctx.render({ categories, todosCountMap });
  }
};

export default function CategoriesPage({ data, state }: PageProps<any, State>) {
  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 animate-fade-in-up">
      <main class="max-w-4xl mx-auto px-4 py-12">
        <div class="mb-12">
          <a href="/" class="text-sm font-bold text-brand-600 hover:text-brand-700 mb-4 inline-flex items-center gap-2 group transition-all">
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Listeye Geri Dön
          </a>
          <h1 class="text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">Kategorileri Yönet</h1>
          <p class="mt-2 text-lg text-gray-500 dark:text-gray-400 font-medium">
            Görevlerinizi gruplandırmak için yeni renkli kategoriler oluşturun.
          </p>
        </div>

        <CategoryManager 
          initialCategories={data.categories} 
          todosCountMap={data.todosCountMap} 
          csrfToken={state.csrfToken} 
        />
      </main>
    </div>
  );
}
