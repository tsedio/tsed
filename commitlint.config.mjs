import {globbySync} from "globby";
import {basename} from "node:path";
import pkg from "./package.json" assert {type: "json"};
import {RuleConfigSeverity} from "@commitlint/types";

function findPackages() {
  const patterns = pkg.workspaces.packages.map((pkgPattern) => {
    return `${pkgPattern}/package.json`;
  });

  let pkgs = globbySync(patterns, {
    cwd: process.cwd(),
  });

  return pkgs.map((pkg) => {
    return basename(pkg.replace("/package.json", ""));
  });
}

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [RuleConfigSeverity.Error, "always", findPackages()],
    "header-max-length": [0, "always", 120],
    "footer-max-line-length": [0, "always", 200],
  },
  ignores: [
    (message) =>
      message.includes("[skip ci]") ||
      !!message.match(
        /^((feat|fix|hotfix|tech|bugfix)\/(([0-9]+)\.?)+(\.[a-zA-Z]+)+) \(#+([0-9]+)\)/g // merge commits (matching a branch name, eg. 'feat/999.bla.bla (#123)')
      )
  ]
};
