// Validate the agent marketplace catalogs, the plugin manifests and the skills shipped under plugins/.
import {existsSync, readdirSync, readFileSync, statSync} from "node:fs";
import {dirname, join, relative, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const ALLOWED_FRONTMATTER = ["name", "description"];
const MAX_SKILL_LINES = 500;
const MAX_DESCRIPTION_LENGTH = 1024;

const errors = [];
const fail = (file, message) => errors.push(`${relative(ROOT, file)}: ${message}`);

function readJson(file) {
  if (!existsSync(file)) {
    fail(file, "file is missing");
    return undefined;
  }

  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (er) {
    fail(file, `invalid JSON (${er.message})`);
    return undefined;
  }
}

function parseFrontmatter(file, content) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(content);

  if (!match) {
    fail(file, "frontmatter is missing");
    return {};
  }

  return Object.fromEntries(
    match[1]
      .split("\n")
      .filter((line) => /^[\w-]+:/.test(line))
      .map((line) => {
        const index = line.indexOf(":");
        return [line.slice(0, index), line.slice(index + 1).trim()];
      })
  );
}

function checkLinks(file, content) {
  for (const [, target] of content.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) {
      continue;
    }

    if (!existsSync(join(dirname(file), target.split("#")[0]))) {
      fail(file, `broken relative link "${target}"`);
    }
  }
}

function checkMarkdown(file) {
  const content = readFileSync(file, "utf8");

  // commented "before" lines of a migration example are allowed
  if (/^\s*import\b[^\n]*from\s+["']@tsed\/common["']/m.test(content)) {
    fail(file, 'examples must not import from "@tsed/common"');
  }

  checkLinks(file, content);

  return content;
}

function checkSkill(dir) {
  const name = dir.split("/").pop();
  const file = join(dir, "SKILL.md");

  if (!existsSync(file)) {
    fail(dir, "SKILL.md is missing");
    return;
  }

  const content = checkMarkdown(file);
  const frontmatter = parseFrontmatter(file, content);
  const unknown = Object.keys(frontmatter).filter((key) => !ALLOWED_FRONTMATTER.includes(key));

  if (unknown.length) {
    fail(file, `unsupported frontmatter keys: ${unknown.join(", ")}`);
  }

  if (frontmatter.name !== name) {
    fail(file, `frontmatter name "${frontmatter.name}" must equal the folder name "${name}"`);
  }

  if (!frontmatter.description) {
    fail(file, "frontmatter description is missing");
  } else if (frontmatter.description.length > MAX_DESCRIPTION_LENGTH) {
    fail(file, `description exceeds ${MAX_DESCRIPTION_LENGTH} characters`);
  } else if (!/Use when/i.test(frontmatter.description)) {
    fail(file, 'description must state its triggers ("Use when ...")');
  }

  if (content.split("\n").length > MAX_SKILL_LINES) {
    fail(file, `SKILL.md exceeds ${MAX_SKILL_LINES} lines; move details to references/`);
  }

  if (!existsSync(join(dir, "agents/openai.yaml"))) {
    fail(dir, "agents/openai.yaml is missing");
  }

  const references = join(dir, "references");

  if (existsSync(references)) {
    readdirSync(references)
      .filter((entry) => entry.endsWith(".md"))
      .forEach((entry) => checkMarkdown(join(references, entry)));
  }
}

function checkPlugin(dir, name) {
  const claude = readJson(join(dir, ".claude-plugin/plugin.json"));
  const codex = readJson(join(dir, ".codex-plugin/plugin.json"));

  if (claude && claude.name !== name) {
    fail(join(dir, ".claude-plugin/plugin.json"), `name must be "${name}"`);
  }

  if (codex) {
    const file = join(dir, ".codex-plugin/plugin.json");

    if (codex.name !== name) {
      fail(file, `name must be "${name}"`);
    }

    [codex.skills, codex.mcpServers, codex.interface?.composerIcon, codex.interface?.logo].filter(Boolean).forEach((path) => {
      if (!existsSync(join(dir, path))) {
        fail(file, `path "${path}" does not exist`);
      }
    });
  }

  if (existsSync(join(dir, ".mcp.json"))) {
    const mcp = readJson(join(dir, ".mcp.json"));

    if (mcp && !Object.keys(mcp.mcpServers || {}).length) {
      fail(join(dir, ".mcp.json"), "mcpServers is empty");
    }
  }

  const skills = join(dir, "skills");

  if (!existsSync(skills)) {
    fail(dir, "skills/ is missing");
    return;
  }

  readdirSync(skills)
    .map((entry) => join(skills, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .forEach(checkSkill);
}

const claudeCatalogFile = join(ROOT, ".claude-plugin/marketplace.json");
const codexCatalogFile = join(ROOT, ".agents/plugins/marketplace.json");
const claudeCatalog = readJson(claudeCatalogFile);
const codexCatalog = readJson(codexCatalogFile);

if (claudeCatalog && codexCatalog) {
  if (claudeCatalog.name !== codexCatalog.name) {
    fail(codexCatalogFile, "marketplace name differs from the Claude Code catalog");
  }

  const claudePlugins = new Map(claudeCatalog.plugins.map((plugin) => [plugin.name, plugin.source]));
  const codexPlugins = new Map(codexCatalog.plugins.map((plugin) => [plugin.name, plugin.source?.path]));

  for (const [name, source] of claudePlugins) {
    if (codexPlugins.get(name) !== source) {
      fail(codexCatalogFile, `plugin "${name}" must point at "${source}" like the Claude Code catalog`);
    }

    if (typeof source !== "string" || !existsSync(join(ROOT, source))) {
      fail(claudeCatalogFile, `plugin "${name}" source does not exist`);
      continue;
    }

    checkPlugin(join(ROOT, source), name);
  }

  for (const name of codexPlugins.keys()) {
    if (!claudePlugins.has(name)) {
      fail(claudeCatalogFile, `plugin "${name}" is missing from the Claude Code catalog`);
    }
  }
}

if (errors.length) {
  console.error(`Agent plugins validation failed:\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("Agent plugins validation passed.");
