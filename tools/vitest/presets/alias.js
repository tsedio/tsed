import {readFileSync} from "node:fs";
import {basename, dirname, join} from "node:path";

import {globbySync} from "globby";

const root = join(import.meta.dirname, "../../..");

function deps(pkg, pkgs, set = new Set()) {
  Object.keys({
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {})
  }).forEach((name) => {
    if (pkgs.has(name)) {
      deps(pkgs.get(name).pkg, pkgs, set);
    }
  });
  set.add(pkg.name);
}

function findPackages() {
  const pkgs = globbySync(
    [
      "packages/*/package.json",
      "packages/graphql/*/package.json",
      "packages/orm/*/package.json",
      "packages/utils/*/package.json",
      "packages/platform/*/package.json",
      "packages/security/*/package.json",
      "packages/specs/*/package.json",
      "packages/third-parties/*/package.json",
      "!**/node_modules/**"
    ],
    {
      cwd: root,
      absolute: true
    }
  ).map((file) => ({
    path: file,
    name: basename(dirname(file)),
    pkg: JSON.parse(readFileSync(file, {encoding: "utf8"}))
  }));

  const pkgsMap = pkgs.reduce((map, data) => {
    map.set(data.pkg.name, data);
    return map;
  }, new Map());

  const set = new Set();

  pkgs.forEach(({pkg}) => {
    deps(pkg, pkgsMap, set);
  });

  return [...set.keys()].map((mod) => pkgsMap.get(mod));
}

const packages = findPackages();

export const alias = packages.reduce((acc, pkg) => {
  return {
    ...acc,
    [pkg.pkg.name]: join(dirname(pkg.path), pkg.pkg.source)
  };
}, {});
