# API Endpoints

This Fresh app uses file-based routes under `routes/`.

## Page Routes

| Method | Path          | Description                                                 | Auth          |
| ------ | ------------- | ----------------------------------------------------------- | ------------- |
| GET    | `/`           | Landing page for guests; todo dashboard for logged-in users | Optional      |
| GET    | `/login`      | Login/register form                                         | Guest         |
| POST   | `/login`      | Login/register form action                                  | Public + CSRF |
| GET    | `/logout`     | Deletes the server session and auth cookie                  | Optional      |
| GET    | `/categories` | Category management page                                    | Required      |

## API Routes

All `/api/*` routes require an authenticated `auth` cookie. Write operations
also require a CSRF token.

| Method | Path              | Description                               | Auth                          |
| ------ | ----------------- | ----------------------------------------- | ----------------------------- |
| GET    | `/api/todos`      | Returns todos for the logged-in user      | Required                      |
| POST   | `/api/todos`      | Creates a todo                            | Required + `x-csrf-token`     |
| PATCH  | `/api/todos`      | Toggles todo completion                   | Required + `x-csrf-token`     |
| DELETE | `/api/todos`      | Deletes a todo                            | Required + `x-csrf-token`     |
| GET    | `/api/categories` | Returns categories for the logged-in user | Required                      |
| POST   | `/api/categories` | Creates a category                        | Required + `_csrf` body field |
| PATCH  | `/api/categories` | Updates a category                        | Required + `_csrf` body field |
| DELETE | `/api/categories` | Deletes a category                        | Required + `_csrf` body field |

## Security Behavior

- Unauthenticated API requests return `401`.
- Invalid CSRF tokens return `403`.
- Login/register is rate-limited to 5 requests per minute per IP/path.
- API write operations are rate-limited to 60 requests per minute per IP/path.
- Todo and category mutations check ownership before writing to Deno KV.
- Security headers are applied globally in `routes/_middleware.ts`.

## OpenAPI

The machine-readable contract is stored at:

```text
openapi.yaml
```
