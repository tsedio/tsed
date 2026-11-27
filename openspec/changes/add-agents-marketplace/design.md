## Context

Claude Code only discovers a marketplace at `.claude-plugin/marketplace.json` in the repository root; Codex reads `.agents/plugins/marketplace.json`. Both accept a plugin source that is a subdirectory of the same repository. skills.sh scans standard directories (including `.agents/skills`) and the plugins declared in the Claude marketplace, and accepts a subpath (`owner/repo/path`).

## Decisions

- **Host the marketplace in the framework repository.** Skills must change in the same pull request as the docs and packages they describe. The cost is a monorepo clone on install, mitigated by `--sparse`.
- **One plugin, `tsed`, for the core packages.** Integrations (ORM, auth, queues, GraphQL) are deferred to a later `tsed-integrations` plugin so every user does not pay their context cost.
- **Shared skills, duplicated manifests.** `plugins/tsed/skills` and `.mcp.json` are shared; only the two catalogs and the two plugin manifests are tool-specific.
- **Portable frontmatter.** Skills declare only `name` and `description`. Codex display metadata lives in `agents/openai.yaml`.
- **Skills carry procedure and pitfalls, docs carry reference.** Skills link to `https://tsed.dev/<page>.md`, `https://cli.tsed.dev/llms.txt` and `https://logger.tsed.dev/llms.txt` instead of copying pages.
- **`tsed-` prefix on skill names.** skills.sh installs skills without a plugin namespace, so names must be unambiguous on their own.
- **MCP command.** `npx -y -p @tsed/cli tsed mcp`: the package name differs from the binary name, so `npx -y @tsed/cli mcp` fails on a first install.
- **Versioning.** The Claude manifest has no `version` so Claude Code tracks commits; the Codex manifest carries a `version` that is bumped manually.
- **Contributor skills stay in `.agents/skills`.** `create-platform-adapter` gets `metadata.internal: true`. The generated `openspec-*` skills are not edited; the documented skills.sh command targets `plugins/tsed`, which never scans `.agents/skills`.

## Risks

- A single `.mcp.json` satisfying both Claude Code and Codex is inferred from the tools' documentation and must be checked on install.
- Skills can drift from the framework. Mitigation: authoring rules in `plugins/tsed/README.md` and validation in CI.
