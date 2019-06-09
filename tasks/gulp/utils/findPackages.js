const glob = require("glob");
const {packagesDir} = require("../../../repo.config");

/**
 *
 * @returns {*}
 */
exports.findPackages = () => {
  const pkgs = glob.sync("*/package.json", {
    cwd: packagesDir
  });

  return pkgs.map((pkg) => pkg.split("/")[0]);
};
