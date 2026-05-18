# Fintech frontend

Angular 21 SPA with Angular Material. No NgModules — all components are standalone.

## Commands

| Command | Purpose |
|---|---|
| `ng serve` | Dev server on :4200. API proxied to localhost:8000 via `proxy.conf.json`. |
| `ng build` | Output to `dist/fintech-frontend/browser`. |
| `ng test` | Runs vitest (not Jasmine/Karma). Tests use `*.spec.ts` files. |

No lint or typecheck scripts exist. Build is the only verification gate.

## Architecture

- **Routes**: lazy-loaded standalone components. Auth guard checks `sessionStorage.getItem('token')`.
- **Auth interceptor** (`core/interceptors/auth.interceptor.ts`): adds Bearer token, queues concurrent requests during 401/refresh, skips `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`.
- **Session**: token, refresh_token, current_user all in `sessionStorage`. Not localStorage.
- **Models**: plain interfaces in `core/models/`. No classes.
- **Forms**: template-driven with `ngForm` + `[(ngModel)]`. No reactive forms.
- **CSS theme**: prebuilt `azure-blue` via `@import` in `styles.scss`. Custom properties in `:root` for colors. No Angular Material custom theme API.

## Quirks

- Existing `spec.ts` files are from the initial scaffold and likely stale. The app.spec.ts checks for "Hello, fintech-frontend" which no longer exists.
- The `test` script uses vitest but there is no `vitest.config.*` file — config is embedded in `angular.json`.
- Docker deployment (`docker compose up -d`) builds a multi-stage image. To update the running container without rebuild: `ng build && docker cp dist/fintech-frontend/browser/. fintech-frontend:/usr/share/nginx/html/`.
- Component styles use SCSS with `styleUrl` (not `styleUrls` or inline). The Angular CLI schematic defaults to SCSS.
- `type` field in movements is always normalized to uppercase (`"INCOME"` / `"EXPENSE"`) by the API. Comparisons should use `.toUpperCase()` for safety.
- Form component for movements (`pages/movements/form/`) doubles as create and edit — checks route param `:id` to distinguish.
- Category budget warning and balance check are both client-side pre-validations; the server enforces the final validation.
