---
head:
  - - meta
    - name: description
      content: Configure any IDE or AI agent to generate correct Ts.ED application code using the agents.md standard and the official Ts.ED documentation.
  - - meta
    - name: keywords
      content: discover ts.ed ai agents framework express typescript node.js javascript decorators mvc class models providers pipes middlewares testing developer
---

# LLM prompts and AI IDE setup

Generating code with large language models (LLMs) is a rapidly growing area of interest for developers.
While LLMs are often capable of generating working code it can be a challenge to generate code for consistently evolving
frameworks like Ts.ED.

Advanced instructions and prompting are an emerging standard for supporting modern code generation details with
domain-specific information.

This section contains curated content and resources to support more accurate code generation for Ts.ED with
LLMs using the [AGENTS.md](https://agents.md) standard.

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

## Application `AGENTS.md` template (recommended)

Here is a set of instructions to help LLMs generate correct code that follows Ts.ED best practices.
This file can be included as system instructions to your AI tooling or included along with your prompt as context.

::: tip Note
This file will be updated on a regular basis staying up to date with Ts.ED's conventions.
:::

<<< @/public/ai/AGENTS.md

[Click here to download the AGENTS.md file.](https://tsed.dev/ai/AGENTS.md)

::: warning
This file is a work in progress. Any feedback or PR is welcome!
:::

## How to use with IDEs or agents

- Ask your tool to index the repository and follow `AGENTS.md` at the root.
- Share the task in a natural language and let the agent reference Ts.ED docs for API details.
- Prefer incremental changes; review and run the suggested validation commands.

## Common tasks and ready‑to‑use prompts

Use or adapt these prompts directly in your IDE/agent:

| Task                      | Prompt                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Create a controller       | Follow `AGENTS.md` and the Ts.ED Controllers guide to add `ProductsController` with `GET /products` and `GET /products/:id`.         |
| Create a DTO + validation | Add `ProductModel` with `@Required() name`, `@Required() price: number`, and validation constraints.                                 |
| Add a service             | Create `ProductsService` with `findAll()` and `findById(id)` and inject it into `ProductsController`.                                |
| Middleware                | Add a `RequestIdMiddleware` that attaches an `x-request-id` header and logs it; apply it with `@UseBefore()` on the products routes. |
| Auth                      | Add a guard ensuring `Bearer` token is present; return `Unauthorized` otherwise.                                                     |
| Exception filter          | Create a `@Catch(NotFound)` filter to standardize 404 responses.                                                                     |
| Tests                     | Add unit tests for `ProductsService` and basic integration tests for `ProductsController`.                                           |
