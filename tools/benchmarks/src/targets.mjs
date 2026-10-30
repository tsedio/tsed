import {execFile} from "node:child_process";
import {cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {join, resolve} from "node:path";
import {promisify} from "node:util";

import {PLATFORMS, platformPackage, RAW_DEPENDENCIES, ROOT_PACKAGES, THIRD_PARTY} from "./deps.mjs";
import {dependencyClosure, listWorkspaces} from "./workspace.mjs";

const exec = promisify(execFile);

export const BENCH_DIR = resolve(import.meta.dirname, "..");
export const REPO_DIR = resolve(BENCH_DIR, "..", "..");
export const TARGETS_DIR = join(BENCH_DIR, ".targets");
export const APP_DIST_DIR = join(BENCH_DIR, "dist", "app");

const VERSION_RE = /^\d+\.\d+\.\d+(-[\w.]+)?$/;

/**
 * Parses a target given on the command line:
 * - a published version (`8.44.1`);
 * - `local`: the packages built in this checkout;
 * - `local-<name>`: the packages built in another checkout, given with `--local-dir local-<name>=<path>`.
 */
export function parseTarget(spec, localDirs = {}) {
  if (VERSION_RE.test(spec)) {
    return {name: spec, kind: "version", version: spec};
  }

  if (spec === "local") {
    return {name: spec, kind: "local", repoDir: localDirs.local || REPO_DIR};
  }

  if (spec.startsWith("local-")) {
    if (!localDirs[spec]) {
      throw new Error(`Target "${spec}" needs its checkout directory: --local-dir ${spec}=<path>`);
    }

    return {name: spec, kind: "local", repoDir: resolve(localDirs[spec])};
  }

  throw new Error(`Unknown target "${spec}": use a version (8.44.1), "local" or "local-<name>"`);
}

/**
 * Builds the package.json of a target. Every dependency is also written as an npm override, so that
 * a transitive dependency (an @tsed/* peer dependency, a `>=` range of a platform) resolves to the
 * same version as the direct one, and never to another version from the registry.
 */
export function createManifest({name, tsed = {}, thirdParty = THIRD_PARTY}) {
  const dependencies = sortKeys({...thirdParty, ...tsed});

  return {
    name: `bench-target-${name.replace(/[^\w-]/g, "-")}`,
    version: "0.0.0",
    private: true,
    type: "module",
    dependencies,
    overrides: {...dependencies}
  };
}

function sortKeys(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
}

/**
 * Lists the @tsed/* packages a version publishes, among the given names.
 * A package missing from that version (e.g. @tsed/platform-fastify before 8.8.0) is left out.
 */
async function publishedPackages(names, version) {
  const results = await Promise.all(
    names.map(async (name) => {
      try {
        const {stdout} = await exec("npm", ["view", `${name}@${version}`, "version", "--json"]);
        return stdout.trim() ? name : null;
      } catch (error) {
        // only a missing package means "not published": a network or registry error must stop the run,
        // otherwise npm would resolve the package from a peer range at another version
        if (`${error.stdout}${error.stderr}`.includes("E404")) {
          return null;
        }

        throw error;
      }
    })
  );

  return results.filter(Boolean);
}

function tsedClosure(repoDir = REPO_DIR) {
  return dependencyClosure(listWorkspaces(repoDir), ROOT_PACKAGES);
}

export async function resolveVersionPackages(version) {
  const {internal} = tsedClosure();
  const names = await publishedPackages(internal, version);

  if (!names.length) {
    throw new Error(`No @tsed/* package published at version ${version}`);
  }

  return Object.fromEntries(names.map((name) => [name, version]));
}

async function npmInstall(dir) {
  rmSync(join(dir, "node_modules"), {recursive: true, force: true});
  rmSync(join(dir, "package-lock.json"), {force: true});

  await exec("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"], {cwd: dir, maxBuffer: 32 * 1024 * 1024});
}

function writeManifest(dir, manifest) {
  mkdirSync(dir, {recursive: true});
  writeFileSync(join(dir, "package.json"), JSON.stringify(manifest, null, 2) + "\n");
}

function isInstalled(dir, manifest) {
  const marker = join(dir, ".installed");
  return existsSync(marker) && readFileSync(marker, "utf8") === JSON.stringify(manifest);
}

function markInstalled(dir, manifest) {
  writeFileSync(join(dir, ".installed"), JSON.stringify(manifest));
}

function copyApp(dir) {
  if (!existsSync(APP_DIST_DIR)) {
    throw new Error(`The bench app is not compiled: run "yarn workspace @tsed/benchmarks bench:app"`);
  }

  rmSync(join(dir, "app"), {recursive: true, force: true});
  cpSync(APP_DIST_DIR, join(dir, "app"), {recursive: true});
}

function availablePlatforms(tsed) {
  return PLATFORMS.filter((platform) => tsed[platformPackage(platform)]);
}

async function installVersion(target, log) {
  const dir = join(TARGETS_DIR, target.name);
  const tsed = await resolveVersionPackages(target.version);
  const manifest = createManifest({name: target.name, tsed});

  if (!isInstalled(dir, manifest)) {
    log(`install ${target.name} from the npm registry`);
    writeManifest(dir, manifest);
    await npmInstall(dir);
    markInstalled(dir, manifest);
  }

  copyApp(dir);

  return {...target, dir, packages: tsed, platforms: availablePlatforms(tsed)};
}

/**
 * Packs the built packages of a checkout and builds the npm overrides that point every @tsed/*
 * package to its tarball.
 */
export function localPackages(internal, tarballDir) {
  return Object.fromEntries(internal.map((name) => [name, `file:${join(tarballDir, `${tarballName(name)}.tgz`)}`]));
}

const tarballName = (name) => name.replace("@", "").replace("/", "-");

async function packWorkspaces(workspaces, internal, tarballDir) {
  mkdirSync(tarballDir, {recursive: true});

  for (const name of internal) {
    const {dir} = workspaces.get(name);

    if (!existsSync(join(dir, "lib", "esm"))) {
      throw new Error(`${name} is not built (${dir}/lib/esm is missing): run "yarn build" first`);
    }

    await exec("yarn", ["pack", "--out", join(tarballDir, `${tarballName(name)}.tgz`)], {cwd: dir});
  }
}

/**
 * Checks, from the npm lockfile, that every @tsed/* package of a local target is installed from a
 * tarball and not from the registry (the workspace versions are placeholders that also exist on npm).
 */
export function findRegistryPackages(lockfile, internal) {
  const expected = new Set(internal);
  const wrong = [];

  for (const [path, entry] of Object.entries(lockfile.packages || {})) {
    const name = path.slice(path.lastIndexOf("node_modules/") + "node_modules/".length);

    if (path && expected.has(name) && !String(entry.resolved).startsWith("file:")) {
      wrong.push(`${path}@${entry.version} (${entry.resolved})`);
    }
  }

  return wrong;
}

async function installLocal(target, log) {
  const dir = join(TARGETS_DIR, target.name);
  const tarballDir = join(dir, "tarballs");
  const workspaces = listWorkspaces(target.repoDir);
  const {internal} = dependencyClosure(workspaces, ROOT_PACKAGES);

  log(`pack ${internal.length} packages from ${target.repoDir}`);
  rmSync(dir, {recursive: true, force: true});
  await packWorkspaces(workspaces, internal, tarballDir);

  const tsed = localPackages(internal, tarballDir);
  const manifest = createManifest({name: target.name, tsed});

  log(`install ${target.name} from the tarballs`);
  writeManifest(dir, manifest);
  await npmInstall(dir);

  const wrong = findRegistryPackages(JSON.parse(readFileSync(join(dir, "package-lock.json"), "utf8")), internal);

  if (wrong.length) {
    throw new Error(`Target ${target.name} resolves @tsed/* packages from the registry: ${wrong.join(", ")}`);
  }

  copyApp(dir);

  return {...target, dir, packages: tsed, platforms: availablePlatforms(tsed)};
}

async function installRaw(log) {
  const dir = join(TARGETS_DIR, "raw");
  const thirdParty = Object.fromEntries(RAW_DEPENDENCIES.map((name) => [name, THIRD_PARTY[name]]));
  const manifest = createManifest({name: "raw", thirdParty});

  if (!isInstalled(dir, manifest)) {
    log("install the raw apps");
    writeManifest(dir, manifest);
    await npmInstall(dir);
    markInstalled(dir, manifest);
  }

  cpSync(join(BENCH_DIR, "raw"), join(dir, "app"), {recursive: true});
  cpSync(join(BENCH_DIR, "app", "ipc.js"), join(dir, "app", "ipc.js"));

  return {name: "raw", kind: "raw", dir, packages: {}, platforms: PLATFORMS};
}

export async function installTarget(target, log = console.log) {
  switch (target.kind) {
    case "version":
      return installVersion(target, log);
    case "local":
      return installLocal(target, log);
    default:
      return installRaw(log);
  }
}

/**
 * Path of the server entry of a target for a platform.
 */
export function entryOf(target, platform) {
  return join(target.dir, "app", target.kind === "raw" ? `${platform}.mjs` : `${platform}.js`);
}
