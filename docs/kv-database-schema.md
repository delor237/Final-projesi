# Deno KV Database Schema

The app stores all persistent data in Deno KV. Keys are grouped by resource and
user ownership.

## Users

```ts
["users", userId];
```

```ts
interface User {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: number;
}
```

Username lookup index:

```ts
["users_by_username", username] -> userId
```

## Sessions

```ts
["sessions", sessionId] -> userId
```

Sessions are created with a seven-day TTL.

## Todos

Direct lookup:

```ts
["todos", todoId];
```

User list lookup:

```ts
["todos_by_user", userId, todoId];
```

```ts
interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  categoryId?: string;
  completed: boolean;
  createdAt: number;
}
```

The app writes both todo keys in one atomic operation.

## Categories

```ts
["categories", userId, categoryId];
```

```ts
interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
}
```

Deleting a category also clears that `categoryId` from the user's todos in the
same atomic operation when possible.
