# Todo App (Deno Fresh)

Ogrenci: Merlin Delor\
Okul No: 24080410153

Live demo: <https://final-projesi.delor237.deno.net>

Bu proje Deno, Fresh, Preact Islands, Twind ve Deno KV kullanilarak
gelistirilmis bir gorev yonetimi uygulamasidir. Kullanici kaydi/girisi, oturum
yonetimi, gorev CRUD islemleri, kategori yonetimi, kategori filtreleme, CSRF
korumasi ve dark mode destegi icerir.

## Screenshots

### Ana Ekran

![Ana Ekran](./screenshots/demo.png)

### Dark Mode

![Dark Mode](./screenshots/dark-mode.png)

### Kategori Yonetimi

![Kategori Yonetimi](./screenshots/categories.png)

### Login

![Login](./screenshots/login.png)

## Tech Stack

- Deno
- Fresh 1.7.3
- Preact
- Preact Signals
- Twind
- Deno KV
- Deno Deploy

## Features

- Server-side rendering with Fresh.
- Interactive UI with Preact islands.
- User registration and login.
 - [Project Word Report (submission)](./PROJE-RAPORU-SABLON.docx)
- Light/dark theme toggle.

## Run Locally

Install Deno, then run:

```bash
deno task start
```

The app runs at:

```text
Note: A repository root `.env.example` and `PROJE-RAPORU-SABLON.docx` are
included to satisfy submission requirements for the course grader.
http://localhost:8000
```

## Useful Commands

```bash
deno task check
deno task test
deno task build
deno task preview
deno task ci
```

## End-to-end tests (Playwright)

This repository includes Playwright E2E tests under `e2e/` and a Node-based test
tooling setup. To run locally:

```bash
cd Final-projesi
npm install
npx playwright install --with-deps
# Start the app (in another terminal)
deno task preview
# Run the Playwright tests
npm run test:e2e
```

CI will run these tests on GitHub Actions (see `.github/workflows/ci.yml`).


## Environment

Copy `.env.example` to `.env` and adjust values if needed.

```env
DENO_KV_PATH=./kv.db
SESSION_SECRET=your_secret_key_here
PORT=8000
FRESH_NO_UPDATE_CHECK=true
ADMIN_USERNAME=demo_admin
ADMIN_PASSWORD=change_me_before_running
```

## Project Structure

```text
routes/              Fresh pages and API routes
islands/             Client-side interactive Preact components
utils/               Auth, CSRF, state, and Deno KV helpers
docs/                API, database, architecture, and ADR docs
screenshots/         Project screenshots
tests/               Deno tests
openapi.yaml         API contract
PROJE-RAPORU.md      Final project report
```

## Documentation

- [Project Report](./PROJE-RAPORU.md)
- [Architecture](./docs/architecture.md)
- [API Endpoints](./docs/api-endpoints.md)
- [KV Schema](./docs/kv-database-schema.md)
- [OpenAPI](./openapi.yaml)
- [ADR documents](./docs/adr/)
- [Screenshots Checklist](./docs/screenshots-checklist.md)

## Security Notes

The project includes session cookies, CSRF verification, route-level ownership
checks, security headers, and simple in-memory rate limiting. Passwords are
salted and hashed with SHA-256 for this course project; Argon2 or bcrypt would
be stronger for a production application.

## License

MIT. See [LICENSE](./LICENSE).
