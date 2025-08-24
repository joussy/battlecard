# Copilot instructions for this repository

applyTo: '\*\*'

Guidelines

- Never fix the formatting of the code.
- Frontend: Vue 3 + Bootstrap 5 (TypeScript), with composition API.
- Backend: NestJS + TypeORM (TypeScript).
- Use openapi-ts to generate types from the OpenAPI spec.
- Build commands:
  - Client build: `npm run build` (run in the `client` folder)
  - Server build: `npm run build` (run in the `server` folder)
- Do not add or rely on unit/e2e tests for tasks (not required).
- Dev container: Debian GNU/Linux 12 (bookworm).
