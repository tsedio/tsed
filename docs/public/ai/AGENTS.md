---
name: Ts.ED Application — AI Collaboration Guide
version: 1.0
last_updated: 2025-11-01
owners:
  - project: Ts.ED
source_of_truth:
  - https://tsed.dev/
  - https://tsed.dev/api.json
---

# Audience

This guide is for AI agents assisting with a Ts.ED APPLICATION (not Ts.ED framework development).

# Objectives

- Scaffold or extend features using Ts.ED patterns (controllers, services, models/DTOs, middlewares, interceptors,
  pipes, validators, exception filters).
- Generate code that compiles, follows decorators usage, and respects dependency injection.
- Use the official Ts.ED documentation for API details and examples.

# Typical repository layout (adjust to your project)

layout:
src/
controllers/
services/
models/ (or dtos/)
middlewares/
interceptors/
protocols/ (auth strategies, guards)
index.ts (server bootstrap)
test/ or src/**/**.spec.ts
package.json

# Commands (adapt to your scripts/package manager)

scripts:
dev: npm run dev | yarn dev | pnpm dev | bun run dev
build: npm run build | yarn build | pnpm build | bun run build
start: npm start | yarn start | pnpm start | bun run start
test: npm test | yarn test | pnpm test | bun test
lint: npm run lint | yarn lint | pnpm lint

# Conventions & scaffolding (CLI)

cli:
name: @tsed/cli
install: npm i -D @tsed/cli | yarn add -D @tsed/cli | pnpm add -D @tsed/cli | bun add -d @tsed/cli
usage:

- tsed generate <resource>
  notes:
- The Ts.ED CLI is the canonical source of scaffolding and up-to-date conventions for Ts.ED.
- Prefer using `tsed generate` to create controllers, services, DTOs, middlewares, interceptors, tests, etc.
- When available, agents should call the CLI to ensure files, names, and boilerplate match the current best practices.

# Plugins & extensions

plugins:
marketplace: https://tsed.dev/plugins/
api: https://api.tsed.io/rest/warehouse
notes:

- Discover community and premium plugins to extend the framework (auth, logging, integrations, etc.).
- Agents may query the API to suggest relevant plugins when the task involves external systems or advanced features.

# Authoritative docs (link instead of copying)

links:
getting_started: https://tsed.dev/introduction/getting-started
controllers: https://tsed.dev/docs/controllers
routing: https://tsed.dev/docs/routing
di_providers: https://tsed.dev/docs/providers
models: https://tsed.dev/docs/model
validation: https://tsed.dev/docs/validation
middlewares: https://tsed.dev/docs/middlewares
pipes: https://tsed.dev/docs/pipes
interceptors: https://tsed.dev/docs/interceptors
authentication: https://tsed.dev/docs/authentication
exceptions: https://tsed.dev/docs/exceptions
request_context: https://tsed.dev/docs/request-context
swagger_openapi: https://tsed.dev/tutorials/swagger
testing: https://tsed.dev/docs/testing
best_practices: https://tsed.dev/introduction/cheat-sheet
cli: https://tsed.dev/docs/cli
plugins_marketplace: https://tsed.dev/plugins/
plugins_api: https://api.tsed.io/rest/warehouse

# Guardrails for AI

rules:

- Prefer minimal diffs; mirror existing code style and naming.
- Always use Ts.ED decorators and DI patterns (e.g., @Controller, @Injectable, @Inject, @UseBefore, @UseAfter,
  @PathParams, @BodyParams, @QueryParams).
- Create DTOs with validation decorators (@Required, @MinLength, @Email, etc.).
- Keep controllers thin; move business logic to services.
- Keep serialization/validation consistent using Json Mapper and class annotations.
- Update or add unit/integration tests near changed files.
- When adding routes, include types, status codes, and example responses; update OpenAPI annotations when applicable.
- Do not change package manager or framework choices.

# How the agent should operate

process:

- Read relevant sections in the links above before generating code.
- Propose the smallest viable change and show a summary of edits.
- Provide follow‑up commands to validate locally (build/test/start).
- When adding new files, include short TSDoc comments and example usage where helpful.

# Common tasks (examples)

examples:

- title: Add a controller with CRUD endpoints
  prompt: |
  Create a Ts.ED controller `UsersController` under `src/controllers`. Use `@Controller("/users")`. Add `GET /:id`,
  `POST /`, and `PUT /:id` endpoints. Validate body with DTOs under `src/models` using Ts.ED validation decorators.
  Inject a `UsersService` for logic.
- title: Create a DTO with validation
  prompt: |
  Create `UserModel` in `src/models` with `id?: string`, `email: string`, `password: string`. Use `@Email()` and
  `@MinLength(8)` as appropriate. Ensure it’s compatible with Ts.ED Json Mapper.
- title: Add a service and inject it in a controller
  prompt: |
  Create `UsersService` in `src/services` annotated with `@Injectable()`. Provide methods `findById`, `create`,
  `update`. Inject it in `UsersController` via constructor and call methods.
- title: Add middleware or interceptor
  prompt: |
  Create a logging middleware using `@Middleware()` and `@UseBefore()` on specific routes. Or create an interceptor with
  `@Interceptor()` and apply via `@UseAfter()`.
- title: Exception handling
  prompt: |
  Use built‑in exceptions (e.g., `BadRequest`, `NotFound`) or create a custom `@Catch()` filter. Ensure consistent error
  response shape.
- title: Tests
  prompt: |
  Add unit tests with your chosen test runner (Jest/Vitest). Co‑locate `*.spec.ts` near the code or under `test/`. Mock
  services and test controller logic.
