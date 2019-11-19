const semver = require("semver");
const log = require("fancy-log");
const chalk = require("chalk");

exports.updateVersions = (field = {}, dependencies, char = "") => {
  Object
    .entries(field)
    .forEach(([mod, version]) => {
      if (dependencies.has(mod)) {
        const currentVersion = version.replace(/^\^/, "");
        const newVersion = dependencies.get(mod);
        if (semver.lt(currentVersion, newVersion)) {
          field[mod] = char + newVersion;
          log("Update", chalk.blue(mod), chalk.cyan(currentVersion), "to", chalk.cyan(char + newVersion));
        }
      }
    });

  return field;
};
