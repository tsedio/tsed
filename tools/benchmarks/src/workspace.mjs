import {existsSync, readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

/**
 * Lists the workspaces of a checkout from the root `package.json` (patterns such as `packages/*`).
 * Returns a map of package name → {dir, pkg}.
 */
export function listWorkspaces(repoDir) {
  const root = readJson(join(repoDir, "package.json"));
  const patterns = Array.isArray(root.workspaces) ? root.workspaces : root.workspaces?.packages || [];
  const workspaces = new Map();

  for (const pattern of patterns) {
    if (!pattern.endsWith("/*")) {
      continue;
    }

    const base = join(repoDir, pattern.slice(0, -2));

    if (!existsSync(base)) {
      continue;
    }

    for (const entry of readdirSync(base, {withFileTypes: true})) {
      const file = join(base, entry.name, "package.json");

      if (entry.isDirectory() && existsSync(file)) {
        const pkg = readJson(file);
        workspaces.set(pkg.name, {dir: join(base, entry.name), pkg});
      }
    }
  }

  return workspaces;
}

/**
 * Computes the @tsed/* packages needed by the roots: their dependencies and peer dependencies,
 * transitively. Packages that are not workspaces (e.g. `@tsed/logger`) are returned apart.
 */
export function dependencyClosure(workspaces, roots) {
  const internal = new Set();
  const external = new Set();

  const visit = (name) => {
    if (internal.has(name) || external.has(name)) {
      return;
    }

    const workspace = workspaces.get(name);

    if (!workspace) {
      external.add(name);
      return;
    }

    internal.add(name);

    const {dependencies = {}, peerDependencies = {}} = workspace.pkg;

    for (const dep of Object.keys({...dependencies, ...peerDependencies})) {
      if (dep.startsWith("@tsed/")) {
        visit(dep);
      }
    }
  };

  roots.forEach(visit);

  return {internal: [...internal].sort(), external: [...external].sort()};
}
