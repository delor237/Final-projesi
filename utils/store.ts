import { signal } from "@preact/signals";
import { Todo } from "./db.ts";

// Island'lar arası haberleşmeyi sağlamak için global bir state (sinyal) kullanıyoruz.
export const todosStore = signal<Todo[]>([]);
