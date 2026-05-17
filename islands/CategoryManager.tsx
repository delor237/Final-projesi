import { useState } from "preact/hooks";
import { Category } from "../utils/db.ts";

interface CategoryManagerProps {
  initialCategories: Category[];
  todosCountMap: Record<string, number>;
  csrfToken: string;
}

export default function CategoryManager({ initialCategories, todosCountMap, csrfToken }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0ea5e9");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleAdd = async (e: Event) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, _csrf: csrfToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setName("");
      setColor("#0ea5e9");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Görevler silinmeyecektir.")) return;

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, _csrf: csrfToken }),
      });

      if (!res.ok) throw new Error("Silme işlemi başarısız");

      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditColor(c.color);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    
    try {
      const res = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName, color: editColor, _csrf: csrfToken }),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız");

      const updated = await res.json();
      setCategories(categories.map((c) => c.id === id ? updated : c));
      setEditingId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div class="space-y-8">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <span class="w-2 h-6 bg-brand-600 rounded-full"></span>
          Yeni Kategori Oluştur
        </h2>
        
        {error && (
          <div class="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center gap-3">
            <span class="text-red-500 font-bold">!</span>
            <p class="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleAdd} class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div class="md:col-span-7">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Kategori Adı</label>
            <input
              type="text"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white placeholder-gray-400 transition-all duration-200"
              placeholder="Örn: Tasarım, Yazılım..."
              disabled={loading}
            />
          </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Renk</label>
            <div class="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2">
              <input
                type="color"
                value={color}
                onInput={(e) => setColor((e.target as HTMLInputElement).value)}
                class="h-8 w-8 bg-transparent cursor-pointer rounded-lg border-0 p-0"
                disabled={loading}
              />
              <span class="text-xs font-mono font-bold text-gray-400 uppercase">{color}</span>
            </div>
          </div>
          <div class="md:col-span-2">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              class="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all duration-200"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.length === 0 ? (
          <div class="col-span-full py-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <p class="text-gray-400 font-medium italic">Henüz hiç kategori oluşturmadınız.</p>
          </div>
        ) : (
          categories.map((c) => (
            <div key={c.id} class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 animate-scale-in">
              {editingId === c.id ? (
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <input
                      type="color"
                      value={editColor}
                      onInput={(e) => setEditColor((e.target as HTMLInputElement).value)}
                      class="h-10 w-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={editName}
                      onInput={(e) => setEditName((e.target as HTMLInputElement).value)}
                      class="flex-grow px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-white"
                    />
                  </div>
                  <div class="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} class="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">İptal</button>
                    <button onClick={() => handleUpdate(c.id)} class="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-lg shadow-green-500/20">Kaydet</button>
                  </div>
                </div>
              ) : (
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg" style={{ backgroundColor: c.color, boxShadow: `0 8px 15px -3px ${c.color}44` }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{c.name}</h3>
                      <span class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg">
                        {todosCountMap[c.id] || 0} Görev
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <button onClick={() => startEdit(c)} class="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-all" title="Düzenle">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(c.id)} class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Sil">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
