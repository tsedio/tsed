#!/usr/bin/env node
/**
 * Lint/format hook shared by Claude Code (`.claude/settings.json`) and Codex (`.codex/hooks.json`).
 *
 * - `post-edit` (PostToolUse): formats the edited files with oxfmt and applies the safe oxlint fixes.
 *   Never blocks: a remaining lint error is reported to the agent as context.
 * - `stop` (Stop): lints every changed file and runs the workspace import guard. On error, blocks the
 *   end of the turn once so the agent fixes the issues.
 *
 * The payload is read from stdin. Claude sends `tool_input.file_path`; Codex `apply_patch` sends a patch
 * with `*** Add File:` / `*** Update File:` markers. Both are supported.
 */
import {spawnSync} from "node:child_process";
import {existsSync} from "node:fs";
import {extname, isAbsolute, join, relative, resolve} from "node:path";

const FORMAT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs", ".json", ".md", ".yml", ".yaml"]);
const LINT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs"]);
const IGNORED_SEGMENTS = ["node_modules/", "/lib/", "/dist/", "/coverage/", "docs/api/"];

const root = git(["rev-parse", "--show-toplevel"]) || process.cwd();
const bin = (name) => join(root, "node_modules", ".bin", name);

function git(args) {
  const result = spawnSync("git", args, {encoding: "utf8"});

  return result.status === 0 ? result.stdout.trim() : "";
}

function run(command, args) {
  const result = spawnSync(command, args, {cwd: root, encoding: "utf8"});

  return {ok: result.status === 0, output: `${result.stdout || ""}${result.stderr || ""}`.trim()};
}

async function readPayload() {
  let raw = "";

  for await (const chunk of process.stdin) {
    raw += chunk;
  }

  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function collectStrings(value, strings = []) {
  if (typeof value === "string") {
    strings.push(value);
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, strings));
  }

  return strings;
}

function editedFiles(payload) {
  const input = payload.tool_input || {};
  const files = [input.file_path, input.notebook_path, input.path].filter((item) => typeof item === "string");

  for (const text of collectStrings(input)) {
    for (const [, file] of text.matchAll(/^\*\*\* (?:Add|Update) File: (.+)$/gm)) {
      files.push(file.trim());
    }

    for (const [, file] of text.matchAll(/^\*\*\* Move to: (.+)$/gm)) {
      files.push(file.trim());
    }
  }

  return files.map((file) => resolve(payload.cwd || root, file));
}

function changedFiles() {
  const tracked = git(["diff", "--name-only", "--diff-filter=ACMR", "HEAD"]);
  const untracked = git(["ls-files", "--others", "--exclude-standard"]);

  return `${tracked}\n${untracked}`
    .split("\n")
    .filter(Boolean)
    .map((file) => join(root, file));
}

function select(files, extensions) {
  return [...new Set(files)]
    .filter((file) => existsSync(file))
    .map((file) => relative(root, file))
    .filter((file) => !file.startsWith("..") && !isAbsolute(file))
    .filter((file) => extensions.has(extname(file)))
    .filter((file) => !IGNORED_SEGMENTS.some((segment) => `/${file}`.includes(segment)));
}

function postEdit(payload) {
  const files = editedFiles(payload);
  const formattable = select(files, FORMAT_EXTENSIONS);
  const lintable = select(files, LINT_EXTENSIONS);

  if (lintable.length) {
    run(bin("oxlint"), ["--fix", ...lintable]);
  }

  if (formattable.length) {
    run(bin("oxfmt"), formattable);
  }

  if (lintable.length) {
    const lint = run(bin("oxlint"), ["--quiet", ...lintable]);

    if (!lint.ok) {
      return {
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: `oxlint reports errors in the edited files:\n${lint.output}`
        }
      };
    }
  }
}

function stop(payload) {
  // The agent already got one chance to fix the issues: do not loop.
  if (payload.stop_hook_active) {
    return;
  }

  const lintable = select(changedFiles(), LINT_EXTENSIONS);

  if (!lintable.length) {
    return;
  }

  const errors = [];
  const lint = run(bin("oxlint"), ["--quiet", ...lintable]);

  if (!lint.ok) {
    errors.push(lint.output);
  }

  const guard = run("node", ["tools/oxc/check-workspace-imports.mjs"]);

  if (!guard.ok) {
    errors.push(guard.output);
  }

  if (errors.length) {
    return {
      decision: "block",
      reason: `Fix the lint errors in the changed files before finishing (yarn test:lint):\n${errors.join("\n\n")}`
    };
  }
}

const handlers = {"post-edit": postEdit, stop};
const handler = handlers[process.argv[2]];

if (!handler) {
  console.error(`Unknown mode "${process.argv[2]}". Expected: ${Object.keys(handlers).join(", ")}`);
  process.exit(1);
}

// Codex requires JSON on stdout for Stop hooks exiting with 0, so always print an object.
process.stdout.write(JSON.stringify(handler(await readPayload()) || {}));
