---
title: Develop with AI (agents.md)
description: Configure any IDE or AI agent to generate correct Ts.ED application code using the agents.md standard and the official Ts.ED documentation.
outline: deep
---

# Develop with AI (AGENTS.md)

This page is for application developers who build with Ts.ED.
It shows how to guide your IDE or AI agent to write correct Ts.ED code by using a single, portable `AGENTS.md` file and
the official docs at https://tsed.dev.

## Why `AGENTS.md` for your Ts.ED app?

- **One file, any tool:** works with agents that can read repo context (Cursor, Copilot Agents, Codeium, JetBrains AI
  Assistant, custom agents, etc.).
- **Consistent results:** the agent follows the same rules you follow, grounded in Ts.ED docs.
- **Low maintenance:** avoids per‑IDE configuration and keeps guidance close to your app code.

## Quick start

1. Create a file named `AGENTS.md` at the root of your Ts.ED application repository.
2. Paste the "Application `AGENTS.md` template" below and adapt project‑specific names and scripts.
3. Ask your agent:

```
Read AGENTS.md at the repository root and follow it for all changes.
```

::: tip Tip
Keep `AGENTS.md` short, precise, and actionable. Link to Ts.ED docs instead of duplicating them.
:::

## Use the Ts.ED API catalog (api.json)

- Ts.ED exposes a machine-readable API catalog at https://tsed.dev/api.json.
- It contains many functions, decorators, services, and symbols provided by Ts.ED packages. Adding it to your agent
  context improves code generation and accuracy.
- Recommendation: add `https://tsed.dev/api.json` to the `source_of_truth` section in your `agents.md` so your IDE/agent
  can fetch and reference it.
- If your tool cannot fetch external URLs automatically, download the file and commit it under a discoverable path (for
  example `docs/tsed-api.json`) and point your agent to that file.

## Use the Ts.ED CLI for scaffolding and conventions

- Ts.ED provides an official CLI: `@tsed/cli`.
- Command: `tsed generate` — prefer this to scaffold controllers, services, DTOs, middlewares, interceptors, tests, etc.
- The CLI is the source of truth for up‑to‑date Ts.ED conventions at any point in time. Using it helps agents produce code that matches current best practices.
- Install (choose one): `npm i -D @tsed/cli`, `yarn add -D @tsed/cli`, `pnpm add -D @tsed/cli`, or `bun add -d @tsed/cli`.
- See CLI documentation: /docs/cli

## Discover plugins and extensions (Marketplace)

- Ts.ED offers a plugins marketplace: https://tsed.dev/plugins/
- You can access the REST resource directly: https://api.tsed.io/rest/warehouse
- These resources are useful when your project needs community or premium plugins to extend framework features (authentication, logging, integrations, etc.).

## Application `AGENTS.md` template (recommended)

Downloadable Ts.ED `AGENTS.md` based on [AGENTS.md](https://agents.md) format (you can use it directly or as a base):

https://tsed.dev/ai/AGENTS.md

Or copy this into your app repo as `AGENTS.md` and customize where indicated.

<<< @/public/ai/AGENTS.md

## How to use with IDEs or agents

- Ask your tool to index the repository and follow `AGENTS.md` at the root.
- Share the task in a natural language and let the agent reference Ts.ED docs for API details.
- Prefer incremental changes; review and run the suggested validation commands.

## Common tasks and ready‑to‑use prompts

Use or adapt these prompts directly in your IDE/agent:

- Create a controller: "Follow `AGENTS.md` and the Ts.ED Controllers guide to add `ProductsController` with
  `GET /products` and `GET /products/:id`."
- Create a DTO + validation: "Add `ProductModel` with `@Required() name`, `@Required() price: number`, and validation
  constraints."
- Add a service: "Create `ProductsService` with `findAll()` and `findById(id)` and inject it into `ProductsController`."
- Middleware: "Add a `RequestIdMiddleware` that attaches an `x-request-id` header and logs it; apply it with
  `@UseBefore()` on the products routes."
- Auth: "Add a guard ensuring `Bearer` token is present; return `Unauthorized` otherwise."
- Exception filter: "Create a `@Catch(NotFound)` filter to standardize 404 responses."
- Tests: "Add unit tests for `ProductsService` and basic integration tests for `ProductsController`."

## Best practices for Ts.ED apps

- Keep controllers small; push logic to services for easier testing.
- Use DTOs and validation decorators to protect your routes.
- Prefer dependency injection over manual singletons.
- Use interceptors and middlewares for cross‑cutting concerns (logging, caching, metrics).
- Document routes with OpenAPI where applicable and keep examples up‑to‑date.

## Troubleshooting

- "Validation doesn’t run" → ensure DTO is used as parameter with `@BodyParams()` and decorators like `@Required()` are
  present.
- "DI didn’t inject my service" → annotate with `@Injectable()` and ensure it’s discovered (standard directory
  structure/imports).
- "Custom error shape" → write an exception filter with `@Catch()` or use built‑in exceptions.
- "Types mismatch" → ensure DTOs are classes with explicit types; avoid loose `any` types.

## See also

- Getting started: /introduction/getting-started
- Controllers: /docs/controllers
- Providers (DI): /docs/providers
- Models & Validation: /docs/model and /docs/validation
- Middlewares & Interceptors: /docs/middlewares and /docs/interceptors
- Exceptions & Filters: /docs/exceptions
- Request context: /docs/request-context
- Testing: /docs/testing
