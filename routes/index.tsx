import { Handlers, PageProps } from "$fresh/server.ts";
import {
  Category,
  getCategoriesByUser,
  getTodosByUser,
  Todo,
} from "../utils/db.ts";
import { State } from "./_middleware.ts";
import TodoForm from "../islands/TodoForm.tsx";
import TodoList from "../islands/TodoList.tsx";
import CategoryFilter from "../islands/CategoryFilter.tsx";

interface Data {
  todos: Todo[];
  categories: Category[];
  todosCountMap: Record<string, number>;
}

export const handler: Handlers<Data, State> = {
  async GET(_req, ctx) {
    if (!ctx.state.user) {
      return ctx.render({ todos: [], categories: [], todosCountMap: {} });
    }
    const todos = await getTodosByUser(ctx.state.user.id);
    const categories = await getCategoriesByUser(ctx.state.user.id);

    const todosCountMap: Record<string, number> = {};
    for (const todo of todos) {
      if (todo.categoryId) {
        todosCountMap[todo.categoryId] = (todosCountMap[todo.categoryId] || 0) +
          1;
      }
    }

    return ctx.render({ todos, categories, todosCountMap });
  },
};

export default function Home({ data, state }: PageProps<Data, State>) {
  if (!state.user) {
    return (
      <div class="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <div class="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-3xl flex items-center justify-center text-brand-600 dark:text-brand-400 text-4xl mb-8 shadow-xl shadow-brand-500/10">
          ✓
        </div>
        <h1 class="text-5xl font-display font-extrabold text-gray-900 dark:text-white mb-6 text-center tracking-tight">
          Modern Görev{" "}
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
            Yönetimi
          </span>
        </h1>
        <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl text-center mb-10 leading-relaxed">
          İşlerinizi organize edin, kategorize edin ve verimliliğinizi artırın.
          Deno Fresh teknolojisiyle yıldırım hızında deneyim.
        </p>

        <div class="flex gap-4">
          <a
            href="/login"
            class="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-1 active:scale-95"
          >
            Hemen Başla
          </a>
          <a
            href="https://fresh.deno.dev"
            target="_blank"
            class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-1"
          >
            Fresh Nedir?
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
            Merhaba, {state.user.username} 👋
          </h1>
          <p class="text-lg text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Bugün yapacak {data.todos.filter((t) => !t.completed).length}{" "}
            göreviniz var.
          </p>
        </div>
        <div class="flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-xl">
          <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          Deno KV Bulut Veritabanı Aktif
        </div>
      </header>

      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent rounded-3xl -z-10">
        </div>
        <CategoryFilter
          categories={data.categories}
          todosCountMap={data.todosCountMap}
          totalTodos={data.todos.length}
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-4 space-y-6">
          <div class="sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 px-1">
              Yeni Görev Ekle
            </h2>
            <TodoForm
              categories={data.categories}
              csrfToken={state.csrfToken}
            />
          </div>
        </div>
        <div class="lg:col-span-8">
          <div class="flex items-center justify-between mb-4 px-1">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Görev Listesi
            </h2>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {data.todos.length} Toplam
            </span>
          </div>
          <TodoList
            initialTodos={data.todos}
            categories={data.categories}
            csrfToken={state.csrfToken}
          />
        </div>
      </div>
    </div>
  );
}
