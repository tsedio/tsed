## 1. Repository guidance fixes

- [x] 1.1 Fix root `AGENTS.md` (OpenSpec references, package layout).
- [x] 1.2 Fix the CLI link in `docs/public/ai/AGENTS.md`.
- [x] 1.3 Replace `@tsed/common` imports in documentation examples.

## 2. Marketplace and plugin

- [x] 2.1 Add the Claude Code and Codex marketplace catalogs.
- [x] 2.2 Add the `tsed` plugin manifests, `.mcp.json` and logos.
- [x] 2.3 Write the thirteen skills with references and Codex metadata.
- [x] 2.4 Mark `create-platform-adapter` as internal for skills.sh.

## 3. Documentation

- [x] 3.1 Add `docs/introduction/ai/agent-plugins.md` and its sidebar entry.
- [x] 3.2 Link it from `develop-with-ai.md`.

## 4. Validation

- [x] 4.1 Validate the catalogs and manifests with the Claude Code and Codex CLIs.
- [x] 4.2 List the skills with `npx skills add ./plugins/tsed --list`.
- [x] 4.3 Start the MCP server with the documented command.
- [x] 4.4 Add marketplace validation to CI.

## 5. Follow-ups

- [ ] 5.1 Point `tsed init` at the marketplace instead of generating pointer skills (tsed-cli).
- [ ] 5.2 Add the `tsed-integrations` plugin.
