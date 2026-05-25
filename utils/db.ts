/// <reference lib="deno.unstable" />

// Deno KV Bağlantısı ve Veri Modelleri
// Sırların kodda yer almaması kuralına uygun olarak path `.env`'den alınıyor.

const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
const kvPath = isDenoDeploy
  ? undefined
  : (Deno.env.get("DENO_KV_PATH") || undefined);
export const kv = await Deno.openKv(kvPath);

// --- TİPLER (INTERFACES) ---

export interface User {
  id: string; // UUID
  username: string;
  passwordHash: string; // Güvenlik kuralı gereği şifreler hash'lenmiş tutulmalıdır
  salt: string; // Her kullanıcıya özel tuz (salt)
  createdAt: number;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  categoryId?: string; // İsteğe bağlı
  completed: boolean;
  createdAt: number;
}

// --- CRUD YARDIMCI FONKSİYONLARI (TODO) ---

/**
 * Yeni bir Todo ekler.
 */
export async function addTodo(
  userId: string,
  title: string,
  categoryId?: string,
  description?: string,
): Promise<Todo> {
  const id = crypto.randomUUID();
  const todo: Todo = {
    id,
    userId,
    title,
    description,
    categoryId,
    completed: false,
    createdAt: Date.now(),
  };

  // Hem doğrudan ID ile erişmek hem de Kullanıcı ID'sine göre listelemek için iki key kullanıyoruz.
  const op = kv.atomic();
  op.set(["todos", id], todo);
  op.set(["todos_by_user", userId, id], todo);

  const res = await op.commit();
  if (!res.ok) throw new Error("Todo eklenirken hata oluştu.");

  return todo;
}

/**
 * Belirli bir kullanıcının tüm Todo'larını listeler (en yeniler en üstte).
 */
export async function getTodosByUser(userId: string): Promise<Todo[]> {
  const iter = kv.list<Todo>({ prefix: ["todos_by_user", userId] });
  const todos: Todo[] = [];

  for await (const res of iter) {
    todos.push(res.value);
  }

  // Oluşturulma tarihine göre azalan (descending) sıralama
  return todos.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Belirli bir Todo'nun tamamlanma durumunu (completed) tersine çevirir.
 */
export async function toggleTodo(
  id: string,
  userId: string,
): Promise<Todo | null> {
  const todoRes = await kv.get<Todo>(["todos", id]);

  // Todo yoksa veya başka bir kullanıcıya aitse işlemi iptal et (Güvenlik kontrolü)
  if (!todoRes.value || todoRes.value.userId !== userId) return null;

  const updatedTodo: Todo = {
    ...todoRes.value,
    completed: !todoRes.value.completed,
  };

  // Atomik olarak veritabanını güncelle
  const op = kv.atomic();
  op.check(todoRes); // Veri okunduğu andan itibaren değişmemişse işlemi yap
  op.set(["todos", id], updatedTodo);
  op.set(["todos_by_user", userId, id], updatedTodo);

  const res = await op.commit();
  if (!res.ok) {
    throw new Error("Todo güncellenirken çakışma (conflict) oluştu.");
  }

  return updatedTodo;
}

/**
 * Belirli bir Todo'yu siler.
 */
export async function deleteTodo(id: string, userId: string): Promise<boolean> {
  const todoRes = await kv.get<Todo>(["todos", id]);

  // Güvenlik kuralı: Sadece Todo'nun sahibi silebilir
  if (!todoRes.value || todoRes.value.userId !== userId) return false;

  const op = kv.atomic();
  op.check(todoRes);
  op.delete(["todos", id]);
  op.delete(["todos_by_user", userId, id]);

  const res = await op.commit();
  return res.ok;
}

// --- KATEGORİ YARDIMCI FONKSİYONLARI (Kısmi Hazırlık) ---

export async function addCategory(
  userId: string,
  name: string,
  color: string,
): Promise<Category> {
  const id = crypto.randomUUID();
  const category: Category = { id, userId, name, color };

  await kv.set(["categories", userId, id], category);
  return category;
}

export async function getCategoriesByUser(userId: string): Promise<Category[]> {
  const iter = kv.list<Category>({ prefix: ["categories", userId] });
  const categories: Category[] = [];

  for await (const res of iter) {
    categories.push(res.value);
  }

  return categories;
}

/**
 * Belirli bir kategoriyi günceller (isim veya renk).
 */
export async function updateCategory(
  id: string,
  userId: string,
  name: string,
  color: string,
): Promise<Category | null> {
  const categoryKey = ["categories", userId, id];
  const categoryRes = await kv.get<Category>(categoryKey);

  if (!categoryRes.value) return null;

  const updatedCategory: Category = { ...categoryRes.value, name, color };

  const op = kv.atomic();
  op.check(categoryRes);
  op.set(categoryKey, updatedCategory);

  const res = await op.commit();
  return res.ok ? updatedCategory : null;
}

/**
 * Belirli bir kategoriyi siler ve ona bağlı tüm görevlerin kategori ID'lerini temizler (Cascade Update).
 */
export async function deleteCategory(
  id: string,
  userId: string,
): Promise<boolean> {
  const categoryKey = ["categories", userId, id];
  const categoryRes = await kv.get<Category>(categoryKey);

  if (!categoryRes.value) return false;

  // Kategoriye bağlı görevleri bul ve güncelle
  const todos = await getTodosByUser(userId);
  const op = kv.atomic();
  op.check(categoryRes);
  op.delete(categoryKey);

  for (const todo of todos) {
    if (todo.categoryId === id) {
      const updatedTodo = { ...todo, categoryId: undefined };
      const todoRes = await kv.get<Todo>(["todos", todo.id]);
      if (todoRes.value) {
        op.check(todoRes);
        op.set(["todos", todo.id], updatedTodo);
        op.set(["todos_by_user", userId, todo.id], updatedTodo);
      }
    }
  }

  const res = await op.commit();
  return res.ok;
}
