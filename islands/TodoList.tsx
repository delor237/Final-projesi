import { useEffect } from "preact/hooks";
import { todosStore } from "../utils/store.ts";
import { Todo } from "../utils/db.ts";

interface TodoListProps {
  initialTodos: Todo[];
  csrfToken: string;
}

export default function TodoList({ initialTodos, csrfToken }: TodoListProps) {
  // Sayfa yüklendiğinde SSR'dan gelen verileri globale al (Sadece bir kez veya veri değiştiğinde)
  useEffect(() => {
    if (todosStore.value.length === 0 && initialTodos.length > 0) {
      todosStore.value = initialTodos;
    }
  }, [initialTodos]);

  const toggleTodo = async (id: string) => {
    // Optimistic UI güncellemesi
    const original = [...todosStore.value];
    todosStore.value = todosStore.value.map(t => t.id === id ? { ...t, completed: !t.completed } : t);

    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Hata olursa eski haline getir
      todosStore.value = original;
      alert("Durum güncellenirken bir hata oluştu.");
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    
    const original = [...todosStore.value];
    todosStore.value = todosStore.value.filter(t => t.id !== id);

    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    } catch {
      alert("Görev silinirken bir hata oluştu.");
      todosStore.value = original;
    }
  };

  const todos = todosStore.value;

  if (todos.length === 0) {
    return (
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p class="text-gray-500 dark:text-gray-400">Henüz hiç görev eklemediniz.</p>
      </div>
    );
  }

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        {todos.map((todo) => (
          <li key={todo.id} class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 pt-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  class="h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div class="flex-1 min-w-0">
                <p class={`text-base font-medium ${todo.completed ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p class={`mt-1 text-sm ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {todo.description}
                  </p>
                )}
                <div class="mt-2 text-xs text-gray-400">
                  {new Date(todo.createdAt).toLocaleString('tr-TR')}
                </div>
              </div>
              
              <div class="flex-shrink-0">
                <button
                  onClick={() => deleteTodo(todo.id)}
                  class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  aria-label="Sil"
                  title="Sil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
