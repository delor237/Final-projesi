import { useState } from "preact/hooks";
import { todosStore } from "../utils/store.ts";
import { Category } from "../utils/db.ts";

interface TodoFormProps {
  categories: Category[];
  csrfToken: string;
}

export default function TodoForm({ categories, csrfToken }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ title: trimmedTitle, description: description.trim(), categoryId }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Görev eklenemedi.");
      }

      const newTodo = await res.json();
      todosStore.value = [newTodo, ...todosStore.value];
      
      setTitle("");
      setDescription("");
      setCategoryId("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-none">
      {error && (
        <div class="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center gap-3">
          <span class="text-red-500 font-bold">!</span>
          <p class="text-xs text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
            Görev Başlığı
          </label>
          <input
            type="text"
            required
            value={title}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white placeholder-gray-400 transition-all duration-200"
            placeholder="Bugün ne yapacaksınız?"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
            Açıklama <span class="text-gray-400 font-normal">(Opsiyonel)</span>
          </label>
          <textarea
            value={description}
            onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white placeholder-gray-400 transition-all duration-200 resize-none"
            rows={3}
            placeholder="Daha fazla detay ekleyin..."
          />
        </div>

        {categories.length > 0 && (
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
              Kategori Seçin
            </label>
            <div class="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId((e.target as HTMLSelectElement).value)}
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white appearance-none cursor-pointer transition-all duration-200"
              >
                <option value="">Kategorisiz</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          class="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none mt-4"
        >
          {isSubmitting ? (
            <span class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kaydediliyor...
            </span>
          ) : "Görevi Kaydet"}
        </button>
      </form>
    </div>
  );
}
