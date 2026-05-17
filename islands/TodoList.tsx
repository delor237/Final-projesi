import { useEffect } from "preact/hooks";
import { todosStore } from "../utils/store.ts";
import { activeCategoryStore } from "../utils/categoryStore.ts";
import { Todo, Category } from "../utils/db.ts";

interface TodoListProps {
  initialTodos: Todo[];
  categories: Category[];
  csrfToken: string;
}

export default function TodoList({ initialTodos, categories, csrfToken }: TodoListProps) {
  const selectedCategory = activeCategoryStore.value;

  useEffect(() => {
    if (todosStore.value.length === 0 && initialTodos.length > 0) {
      todosStore.value = initialTodos;
    }
  }, [initialTodos]);

  const toggleTodo = async (id: string) => {
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
  const filteredTodos = selectedCategory 
    ? todos.filter(t => t.categoryId === selectedCategory) 
    : todos;

  if (todos.length === 0) {
    return (
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-12 text-center animate-scale-in">
        <div class="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-600 text-3xl mx-auto mb-4">
          ∅
        </div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">Henüz hiç görev eklemediniz.</p>
        <p class="text-sm text-gray-400 mt-1">Sol taraftaki formdan yeni bir görev ekleyerek başlayın.</p>
      </div>
    );
  }

  return (
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
      
      {selectedCategory && (
        <div class="p-4 bg-brand-50/50 dark:bg-brand-900/10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-500"></span>
            <span class="text-sm text-brand-700 dark:text-brand-300 font-bold uppercase tracking-wider">
              {categories.find(c => c.id === selectedCategory)?.name} Filtresi Aktif
            </span>
          </div>
          <button 
            onClick={() => activeCategoryStore.value = null}
            class="text-xs px-3 py-1.5 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-bold"
          >
            Tümünü Göster
          </button>
        </div>
      )}

      <ul class="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredTodos.length === 0 ? (
          <li class="p-12 text-center animate-scale-in">
            <p class="text-gray-500 dark:text-gray-400 font-medium">Bu kategoride görev bulunmuyor.</p>
          </li>
        ) : (
          filteredTodos.map((todo) => {
            const category = categories.find(c => c.id === todo.categoryId);
            return (
              <li key={todo.id} class="group p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-300">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 pt-1">
                    <div class="relative">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        class="peer appearance-none h-6 w-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 checked:bg-brand-600 checked:border-brand-600 cursor-pointer transition-all"
                      />
                      <svg class="absolute top-1 left-1 h-4 w-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 flex-wrap mb-1">
                      <p class={`text-lg font-semibold tracking-tight transition-all ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {todo.title}
                      </p>
                      {category && (
                        <button 
                          onClick={(e) => { e.preventDefault(); activeCategoryStore.value = category.id; }}
                          class="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold text-white uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-sm" 
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </button>
                      )}
                    </div>
                    {todo.description && (
                      <p class={`mt-1 text-sm leading-relaxed ${todo.completed ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                        {todo.description}
                      </p>
                    )}
                    <div class="mt-3 flex items-center gap-2 text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(todo.createdAt).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  
                  <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      class="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Görevi Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
