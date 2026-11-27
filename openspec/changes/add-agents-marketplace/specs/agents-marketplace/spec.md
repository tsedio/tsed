## ADDED Requirements

### Requirement: Dual marketplace catalogs

The repository SHALL expose a Claude Code marketplace at `.claude-plugin/marketplace.json` and a Codex marketplace at `.agents/plugins/marketplace.json`, both named `tsed` and both listing a `tsed` plugin sourced from `./plugins/tsed`.

#### Scenario: Install in Claude Code

- **WHEN** a developer runs `claude plugin marketplace add tsedio/tsed` then `claude plugin install tsed@tsed`
- **THEN** the `tsed` plugin skills and the `tsed` MCP server become available in Claude Code.

#### Scenario: Install in Codex

- **WHEN** a developer runs `codex plugin marketplace add tsedio/tsed` then `codex plugin add tsed@tsed`
- **THEN** the `tsed` plugin skills become available in Codex.

### Requirement: Application-developer skills

The `tsed` plugin SHALL ship skills under `plugins/tsed/skills/<name>/SKILL.md` covering documentation lookup, the CLI, configuration, dependency injection, controllers, models and validation, middlewares, exceptions, testing, OpenAPI, the logger, MCP servers and migration to v8. Each skill MUST declare only `name` and `description` in its frontmatter, MUST NOT import from `@tsed/common` in its examples, and MUST link to the published documentation for reference material.

#### Scenario: Skill is portable across agents

- **WHEN** a skill is loaded by Claude Code, Codex or an agent using a skills.sh installation
- **THEN** the same `SKILL.md` and `references/` files are used without modification.

### Requirement: skills.sh installation

The plugin skills SHALL be installable with `npx skills add tsedio/tsed/plugins/tsed`, and that command MUST NOT install the contributor skills stored in `.agents/skills`.

#### Scenario: List plugin skills

- **WHEN** a developer runs `npx skills add tsedio/tsed/plugins/tsed --list`
- **THEN** only the `tsed-*` skills are listed.

### Requirement: Ts.ED CLI MCP server connection

The plugin SHALL declare an MCP server named `tsed` started with `npx -y -p @tsed/cli tsed mcp`.

#### Scenario: First run without the CLI installed

- **WHEN** the agent starts the `tsed` MCP server on a machine where `@tsed/cli` is not installed
- **THEN** `npx` installs the package and runs its `tsed` binary with the `mcp` command.

### Requirement: Installation documentation

The VitePress documentation SHALL describe, on the AI pages, how to install the marketplace in Claude Code and Codex, how to install the skills with skills.sh, and how to configure the MCP server manually.

#### Scenario: Developer follows the documentation

- **WHEN** a developer opens `/introduction/ai/agent-plugins`
- **THEN** the page lists the install commands for each channel, the MCP configuration and the available skills.
