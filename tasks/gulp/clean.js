const {clean} = require("@tsed/monorepo-utils");

module.exports = {
  /**
   *
   * @param gulp
   */
  dist(gulp) {
    return clean([
      "dist"
    ]);
  },
  /**
   *
   * @param gulp
   */
  workspace(gulp) {
    return clean([
      "test/**/*.{js,js.map,d.ts}",
      "test/**/*.{js,js.map,d.ts}",
      "packages/**/src/**/*.{js,js.map,d.ts,d.ts.map}",
      "packages/**/node_modules"
    ]);
  }
};
