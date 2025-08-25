# Copilot instructions for this repository

applyTo: '\*\*'

Guidelines

- Never fix the formatting of the code. Ignore jsonc and prettier linting errors.
- Frontend: Vue 3 + Bootstrap 5 (TypeScript), with composition API.
  - i18n support using vue-i18n. Locale files are in `client/src/locales/`. Support English and French. Nested JSON files.
- Backend: NestJS + TypeORM (TypeScript).
- Use openapi-ts to generate types from the OpenAPI spec.
- Build commands:
  - Client build: `npm run build` (run in the `client` folder)
  - Server build: `npm run build` (run in the `server` folder)
- Do not add or rely on unit/e2e tests for tasks (not required).
- Dev container: Debian GNU/Linux 12 (bookworm).
