import { Handlers, PageProps } from "$fresh/server.ts";
import { getTodosByUser, getCategoriesByUser, Todo, Category } from "../utils/db.ts";
import { State } from "./_middleware.ts";
import TodoForm from "../islands/TodoForm.tsx";
import TodoList from "../islands/TodoList.tsx";

interface Data {
  todos: Todo[];
  categories: Category[];
}

export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    if (!ctx.state.user) {
      return ctx.render({ todos: [], categories: [] });
    }
    const todos = await getTodosByUser(ctx.state.user.id);
    const categories = await getCategoriesByUser(ctx.state.user.id);
    return ctx.render({ todos, categories });
  }
};

export default function Home({ data, state }: PageProps<Data, State>) {
  if (!state.user) {
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

  return (
    <div class="space-y-8">
      <header class="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Görev Yönetimi</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">İşlerinizi organize edin ve takip edin.</p>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <TodoForm categories={data.categories} />
        </div>
        <div class="lg:col-span-2">
          <TodoList initialTodos={data.todos} />
        </div>
      </div>
    </div>
  );
}
