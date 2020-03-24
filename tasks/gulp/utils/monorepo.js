const {MonoRepo} = require("@tsed/monorepo-utils");

const {
  outputDir,
  packagesDir,
  pkgTemplate,
  npmAccess
} = require("../../../repo.config");

exports.monoRepo = new MonoRepo({
  rootDir: process.cwd(),
  outputDir,
  packagesDir,
  npmAccess,
  ignoreSyncDependencies: [
    "express",
    "@types/express"
  ],
  pkgMapper(pkg, {name, rootPkg}) {
    return pkgTemplate(name, rootPkg)(pkg);
  }
});
