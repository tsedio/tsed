#!/usr/bin/env node
/**
 * Lint/format hook shared by Claude Code (`.claude/settings.json`) and Codex (`.codex/hooks.json`).
 *
 * - `post-edit` (PostToolUse): formats the edited files with oxfmt and applies the safe oxlint fixes.
 *   Never blocks: a remaining lint error is reported to the agent as context.
 * - `stop` (Stop): lints every changed file and runs the workspace import guard. On error, blocks the
 *   end of the turn once so the agent fixes the issues. When the turn was already continued by this hook
 *   (`stop_hook_active`), the checks are skipped to avoid an endless loop.
 *
 * The payload is read from stdin. Claude sends `tool_input.file_path`; Codex `apply_patch` sends a patch
 * with `*** Add File:` / `*** Update File:` markers. Both are supported.
 */
import {spawnSync} from "node:child_process";
import {existsSync} from "node:fs";
import {dirname, extname, isAbsolute, join, relative, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const LINT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs"]);
const FORMAT_EXTENSIONS = new Set([...LINT_EXTENSIONS, ".json", ".md", ".yml", ".yaml"]);
// Ignored paths are left to the oxlint/oxfmt configurations.
const TOOL_FLAGS = ["--no-error-on-unmatched-pattern"];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const bin = (name) => join(root, "node_modules", ".bin", name);

function git(args) {
  const result = spawnSync("git", args, {cwd: root, encoding: "utf8"});

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

function editedFiles(payload) {
  const input = payload.tool_input || {};
  const files = [input.file_path, input.notebook_path].filter((item) => typeof item === "string");
  // Codex apply_patch sends the patch in `tool_input.command`.
  const patch = typeof input.command === "string" ? input.command : "";

  for (const [, file] of patch.matchAll(/^\*\*\* (?:Add File|Update File|Move to): (.+)$/gm)) {
    files.push(file.trim());
  }

  return files.map((file) => resolve(payload.cwd || root, file));
}

function changedFiles() {
  // Run from the repository root: `git ls-files` prints paths relative to the current directory.
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
    .filter((file) => extensions.has(extname(file)));
}

function postEdit(payload) {
  const files = editedFiles(payload);
  const formattable = select(files, FORMAT_EXTENSIONS);
  const lintable = select(files, LINT_EXTENSIONS);

  // Formatting never introduces lint errors: the errors left by `--fix` are the final ones.
  const lint = lintable.length ? run(bin("oxlint"), ["--fix", "--quiet", ...TOOL_FLAGS, ...lintable]) : {ok: true};

  if (formattable.length) {
    run(bin("oxfmt"), [...TOOL_FLAGS, ...formattable]);
  }

  if (!lint.ok) {
    return {
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: `oxlint reports errors in the edited files:\n${lint.output}`
      }
    };
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
  const lint = run(bin("oxlint"), ["--quiet", ...TOOL_FLAGS, ...lintable]);

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
