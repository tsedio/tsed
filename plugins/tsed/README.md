# Ts.ED agent plugin

Skills and MCP tooling that teach coding agents how to build Ts.ED v8 applications. The plugin is published from this
repository as a Claude Code marketplace, a Codex marketplace and a [skills.sh](https://skills.sh) source.

User documentation: https://tsed.dev/introduction/ai/agent-plugins.html

## Install

```bash
# Claude Code
claude plugin marketplace add tsedio/tsed --sparse .claude-plugin plugins
claude plugin install tsed@tsed

# Codex
codex plugin marketplace add tsedio/tsed --sparse .agents/plugins --sparse plugins
codex plugin add tsed@tsed

# Any agent, skills only
npx skills add tsedio/tsed/plugins/tsed
```

## Layout

```text
.claude-plugin/marketplace.json     Claude Code catalog (repository root)
.agents/plugins/marketplace.json    Codex catalog (repository root)
plugins/tsed/
  .claude-plugin/plugin.json        Claude Code manifest
  .codex-plugin/plugin.json         Codex manifest
  .mcp.json                         Ts.ED CLI MCP server (shared)
  assets/                           Logos (copied from docs/public)
  skills/<name>/SKILL.md            Skill entry point (shared)
  skills/<name>/references/         Details loaded on demand (shared)
  skills/<name>/agents/openai.yaml  Codex display metadata
```

`plugins/tsed/skills` holds the skills shipped to application developers. `.agents/skills` at the repository root holds
the skills used to work on the framework itself and is not part of the plugin.

## Authoring rules

- Frontmatter contains only `name` (equal to the folder name) and `description` (what the skill does, then
  "Use when ..."). Other keys are not portable across agents.
- Keep `SKILL.md` short and procedural; move tables and long examples to `references/`.
- Link to the documentation (`https://tsed.dev/<page>.md`) instead of copying it.
- Verify every import path, decorator and option against the package sources. Never import from `@tsed/common`.
- When a documented API changes, update the matching skill in the same pull request.
- Bump `version` in `.codex-plugin/plugin.json` when the plugin changes. The Claude Code manifest has no version on
  purpose: Claude Code then tracks the commit.

## Validate

```bash
claude plugin validate .
claude plugin validate plugins/tsed
npx skills add ./plugins/tsed --list
```
