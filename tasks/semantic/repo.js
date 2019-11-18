const logger = require("fancy-log");
const execa = require("execa");
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

    logger("Update all packages with the right version");

    await execa("lerna", ["version", version, "--exact", "--yes", "--no-git-tag-version", "--no-push"], {
      cwd: process.cwd(),
      stdio: ["inherit"]
    });

    await execa("yarn", ["version", "--no-git-tag-version", "--new-version", version], {
      cwd: process.cwd(),
      stdio: ["inherit"]
    });

    await execa("yarn", ["build"], {
      cwd: process.cwd(),
      stdio: ["inherit"]
    });
  },
  /**
   * Publish packages
   */
  async publish(pluginConfig) {
    if (pluginConfig.dryRun) {
      return gulpRepo.publishDryRun();
    }

    return gulpRepo.publish();
  },

  async success() {
  }
};
