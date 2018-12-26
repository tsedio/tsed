const fs = require("fs");
const logger = require("fancy-log");
const gulpRepo = require("../gulp/repo");

module.exports = {
  /**
   * Prepare release before create a new release with semantic-release
   * @returns {Promise<T | never>}
   */
  async prepare(pluginConfig, context) {
    const {
      nextRelease: {version}
    } = context;

    logger("Write package.json");

    const pkg = JSON.parse(fs.readFileSync("./package.json", {encoding: "utf8"}));
    pkg.version = version;

    fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2), {encoding: "utf8"});

    await gulpRepo.build();
  },
  /**
   *
   * @returns {*}
   */
  async publish(pluginConfig) {
    if (pluginConfig.dryRun) {
      return gulpRepo.dryRun();
    }

    return gulpRepo.publish();
  },

  async success() {
  }
};
