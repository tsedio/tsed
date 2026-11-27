## Why

Coding agents generate Ts.ED code from stale training data: legacy `@tsed/common` imports, missing `@tsed/ajv`, undecorated model properties, hand-written boilerplate that ignores the project conventions. The repository only ships contributor skills (`.agents/skills`), and `tsed init` only writes pointer skills that link to `llms.txt`. Application developers have no procedural, framework-aware guidance and no documented way to connect an agent to the Ts.ED CLI MCP server.

## What Changes

- Add a Claude Code marketplace (`.claude-plugin/marketplace.json`) and a Codex marketplace (`.agents/plugins/marketplace.json`) at the repository root, both pointing at `plugins/tsed`.
- Add the `tsed` plugin (`plugins/tsed`) with a Claude Code manifest, a Codex manifest, a shared `.mcp.json` that starts the Ts.ED CLI MCP server with `npx -y -p @tsed/cli tsed mcp`, and logos copied from `docs/public`.
- Add thirteen application-developer skills under `plugins/tsed/skills`: `tsed-docs`, `tsed-cli`, `tsed-configuration`, `tsed-di`, `tsed-controllers`, `tsed-models`, `tsed-middlewares`, `tsed-exceptions`, `tsed-testing`, `tsed-openapi`, `tsed-logger`, `tsed-mcp-server`, `tsed-migration`.
- Make the skills installable with skills.sh (`npx skills add tsedio/tsed/plugins/tsed`) and hide the contributor skill `create-platform-adapter` from default discovery.
- Document installation on the VitePress AI pages (`docs/introduction/ai/agent-plugins.md`).
- Fix the agent guidance the analysis found broken: root `AGENTS.md` references to missing OpenSpec files and `packages/utils`, the `docs/commands.md` link in `docs/public/ai/AGENTS.md`, and documentation examples importing from `@tsed/common`.

## Capabilities

### New Capabilities

- `agents-marketplace`: Distribution of the Ts.ED agent plugin, its skills and its MCP configuration to Claude Code, Codex and skills.sh.

## Impact

- New top-level directories: `.claude-plugin/`, `.agents/plugins/`, `plugins/`.
- `.agents/skills` stays dedicated to framework contributors and is not part of the plugin.
- Documentation: new AI page, sidebar entry, corrected imports in existing pages.
- Related change in `tsedio/tsed-cli`: the docs referenced a `tsed-mcp` binary that does not exist.
- No runtime package is modified; nothing is published to npm.
