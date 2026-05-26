# Screenshots Checklist

Existing screenshots:

- `docs/screenshots/demo.png`
- `docs/screenshots/dark-mode.png`
- `docs/screenshots/categories.png`
- `docs/screenshots/login.png`

Recommended additional screenshots before final submission:

- `docs/screenshots/mobile-view.png` - responsive mobile dashboard.
- `docs/screenshots/empty-state.png` - logged-in user with no todos.
- `docs/screenshots/not-found.png` - 404 page.
- `docs/screenshots/category-edit.png` - category edit state.
- `docs/screenshots/api-unauthorized.png` - optional browser/devtools proof for 401
  API behavior.

Suggested capture flow:

1. Run `deno task preview`.
2. Open `http://localhost:8000`.
3. Capture desktop dashboard after login.
4. Resize browser to mobile width and capture the responsive dashboard.
5. Visit `/missing-page` for the 404 page.
6. Use the category page to capture category creation/editing.
