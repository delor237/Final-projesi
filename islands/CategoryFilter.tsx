import { Category } from "../utils/db.ts";
import { activeCategoryStore } from "../utils/categoryStore.ts";

interface CategoryFilterProps {
  categories: Category[];
  todosCountMap: Record<string, number>;
  totalTodos: number;
}

export default function CategoryFilter(
  { categories, todosCountMap, totalTodos }: CategoryFilterProps,
) {
  const activeId = activeCategoryStore.value;

  return (
    <div class="flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-hide no-scrollbar">
      <button
        type="button"
        onClick={() => activeCategoryStore.value = null}
        class={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border shadow-sm
          ${
          activeId === null
            ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xl shadow-slate-900/10 dark:shadow-white/5 -translate-y-0.5"
            : "bg-white text-slate-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200 dark:bg-gray-800 dark:text-slate-400 dark:border-gray-800 dark:hover:bg-gray-700"
        }`}
      >
        Hepsi
        <span
          class={`px-2 py-0.5 rounded-lg text-[10px] ${
            activeId === null
              ? "bg-white/20 dark:bg-black/10"
              : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          {totalTodos}
        </span>
      </button>

      {categories.map((category) => {
        const isActive = activeId === category.id;
        return (
          <button
            type="button"
            key={category.id}
            onClick={() => activeCategoryStore.value = category.id}
            class={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border shadow-sm
              ${
              isActive
                ? "text-white shadow-xl -translate-y-0.5 border-transparent"
                : "bg-white text-slate-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200 dark:bg-gray-800 dark:text-slate-400 dark:border-gray-800 dark:hover:bg-gray-700"
            }`}
            style={isActive
              ? {
                backgroundColor: category.color,
                boxShadow: `0 10px 15px -3px ${category.color}33`,
              }
              : {}}
          >
            <span
              class="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
              style={{ backgroundColor: isActive ? "white" : category.color }}
            >
            </span>
            {category.name}
            <span
              class={`px-2 py-0.5 rounded-lg text-[10px] ${
                isActive ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              {todosCountMap[category.id] || 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
