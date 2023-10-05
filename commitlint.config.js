const globby = require("globby");
const {basename, dirname} = require("path");
const pkg = require("./package.json");
const {RuleConfigSeverity} = require("@commitlint/types");

function findPackages() {
  const patterns = pkg.workspaces.packages.map((pkgPattern) => {
    return `${pkgPattern}/package.json`;
  });

  let pkgs = globby.sync(patterns, {
    cwd: __dirname
  });

  return pkgs.map((pkg) => {
    return basename(pkg.replace("/package.json", ""));
  });
}

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [RuleConfigSeverity.Error, "always", findPackages()],
    "header-max-length": [0, "always", 120]
  },
  ignores: [
    (message) =>
      message.includes("[skip ci]") ||
      !!message.match(
        /^((feat|fix|hotfix|tech|bugfix)\/(([0-9]+)\.?)+(\.[a-zA-Z]+)+) \(#+([0-9]+)\)/g // merge commits (matching a branch name, eg. 'feat/999.bla.bla (#123)')
      )
  ]
};
