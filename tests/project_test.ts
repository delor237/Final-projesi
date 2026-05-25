import { assert, assertEquals, assertNotEquals } from "$std/assert/mod.ts";
import type { Category, Todo, User } from "../utils/db.ts";

const auth = await import("../utils/auth.ts");
const db = await import("../utils/db.ts");
const todoApi = await import("../routes/api/todos.ts");
const categoryApi = await import("../routes/api/categories.ts");

function ctx(user: User | null, csrfToken = "csrf-test") {
  return {
    state: { user, csrfToken },
  } as never;
}

async function readJson<T>(response: Response): Promise<T> {
  return await response.json() as T;
}

Deno.test("auth registers and authenticates a user", async () => {
  const username = `user-${crypto.randomUUID()}`;
  const password = "secret123";

  const user = await auth.registerUser(username, password);
  assert(user);
  assertEquals(user.username, username);
  assertNotEquals(user.passwordHash, password);

  const duplicate = await auth.registerUser(username, password);
  assertEquals(duplicate, null);

  const authenticated = await auth.authenticateUser(username, password);
  assert(authenticated);
  assertEquals(authenticated.id, user.id);

  const rejected = await auth.authenticateUser(username, "wrong-password");
  assertEquals(rejected, null);
});

Deno.test("sessions resolve users and can be deleted", async () => {
  const username = `session-${crypto.randomUUID()}`;
  const user = await auth.registerUser(username, "secret123");
  assert(user);

  const sessionId = await auth.createSession(user.id);
  const sessionUser = await auth.getUserBySession(sessionId);
  assert(sessionUser);
  assertEquals(sessionUser.id, user.id);

  await auth.deleteSession(sessionId);
  const deletedSessionUser = await auth.getUserBySession(sessionId);
  assertEquals(deletedSessionUser, null);
});

Deno.test("todos can be added, toggled, listed, and deleted by owner", async () => {
  const userId = crypto.randomUUID();

  const todo = await db.addTodo(
    userId,
    "Write report",
    undefined,
    "Finish docs",
  );
  assertEquals(todo.completed, false);

  const listed = await db.getTodosByUser(userId);
  assert(listed.some((item) => item.id === todo.id));

  const toggled = await db.toggleTodo(todo.id, userId);
  assert(toggled);
  assertEquals(toggled.completed, true);

  const blocked = await db.toggleTodo(todo.id, crypto.randomUUID());
  assertEquals(blocked, null);

  const deleted = await db.deleteTodo(todo.id, userId);
  assertEquals(deleted, true);
});

Deno.test("categories can be added, updated, listed, and deleted", async () => {
  const userId = crypto.randomUUID();

  const category = await db.addCategory(userId, "School", "#0ea5e9");
  assertEquals(category.name, "School");

  const updated = await db.updateCategory(
    category.id,
    userId,
    "University",
    "#22c55e",
  );
  assert(updated);
  assertEquals(updated.name, "University");

  const listed = await db.getCategoriesByUser(userId);
  assert(listed.some((item) => item.id === category.id));

  const deleted = await db.deleteCategory(category.id, userId);
  assertEquals(deleted, true);
});

Deno.test("todo API lists authenticated user's todos", async () => {
  const user = await auth.registerUser(
    `api-todos-${crypto.randomUUID()}`,
    "secret123",
  );
  assert(user);

  const todo = await db.addTodo(user.id, "API listed todo");
  const response = await todoApi.handler.GET!(
    new Request("http://localhost/api/todos"),
    ctx(user),
  );

  assertEquals(response.status, 200);
  const todos = await readJson<Todo[]>(response);
  assert(todos.some((item) => item.id === todo.id));
});

Deno.test("todo API rejects invalid create payloads", async () => {
  const user = await auth.registerUser(
    `api-invalid-todo-${crypto.randomUUID()}`,
    "secret123",
  );
  assert(user);

  const response = await todoApi.handler.POST!(
    new Request("http://localhost/api/todos", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": "csrf-test",
        cookie: "csrf_token=csrf-test",
      },
      body: JSON.stringify({ title: "" }),
    }),
    ctx(user),
  );

  assertEquals(response.status, 400);
});

Deno.test("category API lists authenticated user's categories", async () => {
  const user = await auth.registerUser(
    `api-categories-${crypto.randomUUID()}`,
    "secret123",
  );
  assert(user);

  const category = await db.addCategory(user.id, "API Category", "#0ea5e9");
  const response = await categoryApi.handler.GET!(
    new Request("http://localhost/api/categories"),
    ctx(user),
  );

  assertEquals(response.status, 200);
  const categories = await readJson<Category[]>(response);
  assert(categories.some((item) => item.id === category.id));
});

Deno.test("category API rejects invalid colors", async () => {
  const user = await auth.registerUser(
    `api-invalid-category-${crypto.randomUUID()}`,
    "secret123",
  );
  assert(user);

  const response = await categoryApi.handler.POST!(
    new Request("http://localhost/api/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Invalid",
        color: "blue",
        _csrf: "csrf-test",
      }),
    }),
    ctx(user),
  );

  assertEquals(response.status, 400);
});
