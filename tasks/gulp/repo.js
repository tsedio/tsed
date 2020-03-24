const {monoRepo} = require("./utils/monorepo");

module.exports = {
  async clean() {
    return monoRepo.clean();
  },

  async syncDependencies() {
    return monoRepo.syncDependencies();
  },

  async compilePackages() {
    return monoRepo.compilePackages();
  },

  async build() {
    return monoRepo.build();
  },

  async copy() {
    return monoRepo.copyPackages();
  },

  async writePackages() {
    return monoRepo.writePackages();
  },

  async publishDryRun() {
    return monoRepo.publish({dryRun: true});
  },

  publish() {
    return monoRepo.publish({dryRun: false});
  }
};
