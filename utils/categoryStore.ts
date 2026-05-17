import { signal } from "@preact/signals";

// Aktif kategori ID'sini tutar. null ise "Tümü" seçilidir.
export const activeCategoryStore = signal<string | null>(null);
