# Architecture

This document records the current architecture of the Deno Fresh Todo
application.

## Context

```mermaid
flowchart LR
    User["Browser user"]
    App["Deno Fresh Todo App"]
    Deploy["Deno Deploy"]
    KV[("Deno KV")]

    User --> App
    App --> KV
    Deploy --> App
```

## Containers

```mermaid
flowchart TD
    Browser["Browser"]
    SSR["Fresh SSR routes"]
    Islands["Preact islands"]
    Middleware["Auth / CSRF middleware"]
    TodoAPI["/api/todos"]
    CategoryAPI["/api/categories"]
    Auth["utils/auth.ts"]
    DB["utils/db.ts"]
    KV[("Deno KV")]

    Browser --> SSR
    Browser --> Islands
    SSR --> Middleware
    Middleware --> Auth
    SSR --> DB
    Islands --> TodoAPI
    Islands --> CategoryAPI
    TodoAPI --> DB
    CategoryAPI --> DB
    Auth --> KV
    DB --> KV
```

## Login Flow

```mermaid
sequenceDiagram
    participant User
    participant Login as routes/login.tsx
    participant Auth as utils/auth.ts
    participant KV as Deno KV

    User->>Login: POST username/password/_csrf
    Login->>Login: Verify CSRF token
    Login->>Auth: authenticateUser or registerUser
    Auth->>KV: Read/write user records
    Auth-->>Login: User
    Login->>Auth: createSession
    Auth->>KV: Store session with TTL
    Login-->>User: Set auth cookie and redirect
```

## Todo Flow

```mermaid
sequenceDiagram
    participant User
    participant Island as TodoForm/TodoList
    participant API as routes/api/todos.ts
    participant DB as utils/db.ts
    participant KV as Deno KV

    User->>Island: Add, toggle, or delete todo
    Island->>API: JSON request with CSRF token
    API->>API: Verify auth and CSRF
    API->>DB: addTodo/toggleTodo/deleteTodo
    DB->>KV: Atomic read/write
    KV-->>DB: Result
    DB-->>API: Todo/result
    API-->>Island: JSON response
```

## Category Flow

```mermaid
sequenceDiagram
    participant User
    participant Island as CategoryManager
    participant API as routes/api/categories.ts
    participant DB as utils/db.ts
    participant KV as Deno KV

    User->>Island: Add, edit, or delete category
    Island->>API: JSON request with _csrf
    API->>API: Verify auth and CSRF
    API->>DB: addCategory/updateCategory/deleteCategory
    DB->>KV: Read/write category and related todos
    KV-->>DB: Result
    DB-->>API: Category/result
    API-->>Island: JSON response
```

## Data Model

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ TODO : owns
    USER ||--o{ CATEGORY : owns
    CATEGORY ||--o{ TODO : groups

    USER {
      string id
      string username
      string passwordHash
      string salt
      number createdAt
    }

    SESSION {
      string sessionId
      string userId
      number ttl
    }

    TODO {
      string id
      string userId
      string title
      string description
      string categoryId
      boolean completed
      number createdAt
    }

    CATEGORY {
      string id
      string userId
      string name
      string color
    }
```

## Deployment Topology

```mermaid
flowchart LR
    User["Browser"]
    DenoDeploy["Deno Deploy edge runtime"]
    App["Fresh application"]
    KV[("Deno KV")]

    User --> DenoDeploy
    DenoDeploy --> App
    App --> KV
```
