---
description: "Install the official Ts.ED plugin for Claude Code and Codex, or the Ts.ED skills with skills.sh, and connect your agent to the Ts.ED CLI MCP server."
head:
  - - meta
    - name: description
      content: Install the official Ts.ED plugin for Claude Code and Codex, or the Ts.ED skills with skills.sh, and connect your agent to the Ts.ED CLI MCP server.
  - - meta
    - name: keywords
      content: ts.ed ai agents skills plugin marketplace claude code codex mcp skills.sh typescript node.js
---

# Agent plugins & skills

Ts.ED publishes an official agent plugin that teaches coding agents how to build Ts.ED v8 applications. It bundles:

- **Skills** covering the core packages of the framework (controllers, DI, models, validation, middlewares, exceptions,
  testing, OpenAPI, logger, MCP).
- **The Ts.ED CLI MCP server**, so the agent can scaffold projects and generate files with the same templates as
  `tsed init` and `tsed generate`.

The plugin lives in the [Ts.ED repository](https://github.com/tsedio/tsed/tree/production/plugins/tsed) and is
distributed through three channels. Pick the one that matches your agent.

| Channel                         | Skills | MCP server | Agents                                           |
| ------------------------------- | ------ | ---------- | ------------------------------------------------ |
| Claude Code plugin marketplace  | Yes    | Yes        | Claude Code (CLI, desktop, IDE extensions)       |
| Codex plugin marketplace        | Yes    | Yes        | Codex CLI and Codex in the ChatGPT desktop app   |
| [skills.sh](https://skills.sh/) | Yes    | Manual     | Cursor, Copilot, Windsurf, Gemini CLI and others |

::: tip
The plugin complements the [`AGENTS.md` template](/introduction/ai/develop-with-ai): `AGENTS.md` describes _your_
project, the skills describe _the framework_.
:::

## Claude Code

Add the marketplace, then install the plugin:

```bash
claude plugin marketplace add tsedio/tsed --sparse .claude-plugin plugins
claude plugin install tsed@tsed
```

Or from inside a Claude Code session:

```text
/plugin marketplace add tsedio/tsed
/plugin install tsed@tsed
```

`--sparse` limits the checkout to the marketplace files instead of cloning the whole framework monorepo.

To share the plugin with your team, declare it in the `.claude/settings.json` of your application:

```json
{
  "extraKnownMarketplaces": {
    "tsed": {
      "source": {
        "source": "github",
        "repo": "tsedio/tsed"
      }
    }
  },
  "enabledPlugins": {
    "tsed@tsed": true
  }
}
```

Skills are namespaced by the plugin, for example `/tsed:tsed-controllers`. Claude also loads them on its own when a
task matches their description.

### Claude desktop app

The **Code** tab of the Claude desktop app reads the same settings files as the `claude` CLI: a plugin installed at user
scope from the terminal is already available in the desktop app, and the other way round.

To install the plugin from the desktop app:

1. Open a local session in the **Code** tab, click the **+** button next to the prompt box, then select
   **Plugins** > **Add plugin**.
2. In the plugin browser, choose to add a third-party marketplace and enter `tsedio/tsed`.
3. Select **Ts.ED** and choose a scope: your user account, this project, or local-only.

The marketplace only has to be added once. You can also register it from a terminal, or declare it in the
`.claude/settings.json` of your project (see the snippet above):

```bash
claude plugin marketplace add tsedio/tsed --sparse .claude-plugin plugins
```

Use **+** > **Plugins** > **Manage plugins** to enable, disable or uninstall the plugin later.

::: warning
The plugin browser is available in local and SSH sessions only. Cloud sessions and WSL sessions don't load the plugins
installed on your machine.
:::

## Codex

Add the marketplace:

```bash
codex plugin marketplace add tsedio/tsed --sparse .agents/plugins --sparse plugins
```

Then install the `tsed` plugin from the plugin browser (`/plugins` in Codex) or from the shell:

```bash
codex plugin add tsed@tsed
```

### Codex app

Codex in the ChatGPT desktop app installs plugins from the **Plugins Directory**, where each marketplace appears as a
selectable source.

1. Add the Ts.ED marketplace with the Codex CLI:

   ```bash
   codex plugin marketplace add tsedio/tsed --sparse .agents/plugins --sparse plugins
   ```

2. Restart the ChatGPT desktop app.
3. Open the **Plugins Directory**, choose the **Ts.ED** marketplace, then install the **Ts.ED** plugin.
4. Start a new chat: the skills and the MCP tools of the plugin are only loaded in new sessions.

::: tip
No Codex CLI? Declare the marketplace yourself in `~/.agents/plugins/marketplace.json` (personal) or
`.agents/plugins/marketplace.json` (repository), then restart the app. See
[Build plugins](https://developers.openai.com/codex/plugins/build) in the Codex documentation.
:::

## skills.sh (any agent)

The [`skills`](https://skills.sh/) CLI copies the skills into the directory your agent reads (`.agents/skills`,
`.claude/skills`, `.cursor/skills`, ...). Always target the plugin directory so only the application skills are
installed:

```bash
# pick skills and agents interactively
npx skills add tsedio/tsed/plugins/tsed

# list the available skills
npx skills add tsedio/tsed/plugins/tsed --list

# install everything for specific agents, without prompts
npx skills add tsedio/tsed/plugins/tsed --skill '*' -a claude-code -a codex -y
```

Add `-g` to install the skills globally instead of in the current project.

::: warning
skills.sh installs skills only. Configure the MCP server yourself with the snippet below.
:::

## Ts.ED CLI MCP server

The plugin registers the MCP server bundled with [`@tsed/cli`](https://cli.tsed.dev). If you installed the skills with
skills.sh, or use another MCP client, declare it manually. It requires Node.js 22 or newer.

::: code-group

```json [.mcp.json (Claude Code, Cursor, ...)]
{
  "mcpServers": {
    "tsed": {
      "command": "npx",
      "args": ["-y", "-p", "@tsed/cli", "tsed", "mcp"]
    }
  }
}
```

```toml [~/.codex/config.toml]
[mcp_servers.tsed]
command = "npx"
args = ["-y", "-p", "@tsed/cli", "tsed", "mcp"]
```

```bash [Claude Code CLI]
claude mcp add tsed -- npx -y -p @tsed/cli tsed mcp
```

:::

::: warning
Use `npx -y -p @tsed/cli tsed mcp`. The shorter `npx -y @tsed/cli mcp` fails when the CLI is not installed yet,
because the package name is not the binary name.
:::

The server exposes the following capabilities:

| Kind     | Name                  | Purpose                                                        |
| -------- | --------------------- | -------------------------------------------------------------- |
| Tool     | `set-workspace`       | Select the project directory used by the other tools.          |
| Tool     | `init-project`        | Scaffold a new Ts.ED project (same options as `tsed init`).    |
| Tool     | `list-templates`      | List the generator templates, including your custom templates. |
| Tool     | `get-template`        | Describe a template and its JSON schema.                       |
| Tool     | `generate-file`       | Generate a file from a template (same as `tsed generate`).     |
| Resource | `tsed://init/options` | Options accepted by `init-project`.                            |
| Resource | `tsed://project/info` | Current project, its `package.json` and Ts.ED preferences.     |
| Resource | `tsed://server/info`  | CLI and MCP server versions.                                   |

## Available skills

| Skill                | Use it to                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `tsed-docs`          | Find the right documentation page through `llms.txt` and the markdown twin of each page. |
| `tsed-cli`           | Scaffold projects and generate files with the CLI or its MCP server.                     |
| `tsed-configuration` | Configure the server, the platform adapter and the configuration sources.                |
| `tsed-di`            | Write providers, use the functional DI API, scopes, hooks and the request context.       |
| `tsed-controllers`   | Write controllers, routes, parameters and responses.                                     |
| `tsed-models`        | Declare models, validate inputs and serialize outputs.                                   |
| `tsed-middlewares`   | Add middlewares, interceptors, pipes and authentication guards.                          |
| `tsed-exceptions`    | Throw HTTP exceptions, write exception filters and response filters.                     |
| `tsed-testing`       | Write unit and integration tests with Vitest and `PlatformTest`.                         |
| `tsed-openapi`       | Document the API with Swagger or Scalar.                                                 |
| `tsed-logger`        | Configure `@tsed/logger`, appenders, layouts and request logging.                        |
| `tsed-mcp-server`    | Expose MCP tools, resources and prompts from your application.                           |
| `tsed-migration`     | Migrate an application to Ts.ED v8.                                                      |

## Documentation for agents

The skills link to the documentation instead of duplicating it. Each documentation site exposes an
[`llms.txt`](https://llmstxt.org/) index, and every page is available as markdown by appending `.md` to its URL
(for example `https://tsed.dev/docs/controllers.md`).

| Site      | Index                                                                |
| --------- | -------------------------------------------------------------------- |
| Framework | [https://tsed.dev/llms.txt](https://tsed.dev/llms.txt)               |
| CLI       | [https://cli.tsed.dev/llms.txt](https://cli.tsed.dev/llms.txt)       |
| Logger    | [https://logger.tsed.dev/llms.txt](https://logger.tsed.dev/llms.txt) |

## Update

```bash
# Claude Code
claude plugin marketplace update tsed

# Codex
codex plugin marketplace upgrade tsed

# skills.sh
npx skills update
```

## Feedback

The skills are maintained with the framework. Open an issue or a pull request on
[GitHub](https://github.com/tsedio/tsed/issues) when a skill produces outdated or incorrect code.
