import { useState } from "preact/hooks";
import { todosStore } from "../utils/store.ts";
import { Category } from "../utils/db.ts";

interface TodoFormProps {
  categories: Category[];
}

export default function TodoForm({ categories }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, categoryId }),
      });

      if (!res.ok) throw new Error("Görev eklenemedi.");

      const newTodo = await res.json();
      // Global listeyi anında güncelle (Optimistic veya fetch sonrası)
      todosStore.value = [newTodo, ...todosStore.value];
      
      // Formu temizle
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Yeni Görev Ekle</h2>
      
      {error && (
        <div class="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Görev Başlığı *
          </label>
          <input
            type="text"
            required
            value={title}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ne yapılması gerekiyor?"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Açıklama (Opsiyonel)
          </label>
          <textarea
            value={description}
            onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white resize-none"
            rows={3}
            placeholder="Detaylar..."
          />
        </div>

        {categories.length > 0 && (
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId((e.target as HTMLSelectElement).value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">-- Kategori Seç --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Ekleniyor..." : "Görevi Ekle"}
        </button>
      </form>
    </div>
  );
}
