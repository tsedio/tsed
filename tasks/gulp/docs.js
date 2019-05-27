const {buildApi} = require("@typedproject/ts-doc");
const execa = require("execa");
const path = require("path");
const fs = require("fs");
const sourcemaps = require("gulp-sourcemaps");
const gulp = require("gulp");
const clean = require("gulp-clean");
const ts = require("gulp-typescript");
const logger = require("fancy-log");
const chalk = require("chalk");
const {tsdoc, packagesDir} = require("../../repo.config");

/**
 *
 * @param stream
 * @returns {Promise<any>}
 */
const toPromise = stream =>
  new Promise((resolve, reject) =>
    stream
      .on("end", resolve)
      .on("finish", resolve)
      .on("error", reject)
  );

module.exports = {
  async clean(g = gulp) {
    const stream = g.src(path.join(process.cwd(), "docs", "api"), {read: false, allowEmpty: true}).pipe(clean());

    return toPromise(stream);
  },

  async buildApi() {
    await module.exports.compile();
    await module.exports.clean();
    await buildApi(tsdoc);
  },

  async build() {
    await module.exports.buildApi();
    await execa("vuepress", ["build", "docs"], {stdio: "inherit"});
  },

  async compile() {
    logger(`Starting '${chalk.cyan("docs:compile")}'...`);
    const tsProject = ts.createProject("./tsconfig.compile.json", {
      "declaration": true,
      "noResolve": false,
      "preserveConstEnums": true
    });

    const stream = tsProject.src()
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .once("error", function() {
        this.once("finish", () => {
          throw new Error("fails with errors");
        });
      })
      .pipe(sourcemaps.write(".", {sourceRoot: "./"}))
      .pipe(gulp.dest(packagesDir));

    return toPromise(stream).then(() => {
      logger(`Finished '${chalk.cyan("docs:compile")}'`);
    });
  },

  async serve() {
    await module.exports.buildApi();
    await execa("vuepress", ["dev", "docs"], {stdio: "inherit"});
  },

  async publish() {

  }
};
