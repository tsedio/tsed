const glob = require("globby");
const {join} = require("path");
const {packagesDir} = require("../../../repo.config");

/**
 *
 * @returns {*}
 */
exports.findPackages = () => {
  const pkgs = glob.sync("*/package.json", {
    cwd: packagesDir
  });

  return pkgs
    .filter(file => require(join(process.cwd(), packagesDir, file)).private !== true)
    .map((pkg) => pkg.split("/")[0]);
};
