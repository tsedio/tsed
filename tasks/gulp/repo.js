/* eslint-disable global-require,no-template-curly-in-string */
const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const logger = require("fancy-log");
const replace = require("gulp-replace");
const clean = require("gulp-clean");
const jeditor = require("gulp-json-editor");
const {getDependencies} = require("./utils/getDependencies");
const {sync} = require("execa");
const semver = require("semver");
const {updateVersions} = require("./utils/updateVersions");
const {writePackage} = require("./utils/writePackage");

const {all} = require("./utils/all");
const {findPackages} = require("./utils/findPackages");
const {readPackage} = require("./utils/readPackage");
const {toPromise} = require("./utils/toPromise");

const {
  outputDir,
  packagesDir,
  pkgTemplate,
  npmAccess,
  npmScope,
  versionPlaceholder
} = require("../../repo.config");

module.exports = {
  /**
   *
   * @param g
   */
  async clean(g = gulp) {
    const stream = g.src(outputDir, {read: false, allowEmpty: true}).pipe(clean());

    return toPromise(stream);
  },

  async syncDependencies() {
    const packages = findPackages();
    const dependencies = getDependencies();
    dependencies.delete("express");
    dependencies.delete("@types/express");

    const promises = packages.map(async (pkg) => {
      const pkgPath = `./${path.join(packagesDir, pkg, "package.json")}`;
      const currentPkg = await readPackage(pkgPath);

      logger("Update package.json", chalk.cyan(`'${npmScope}/${pkg}'`));

      currentPkg.dependencies = updateVersions(currentPkg.dependencies, dependencies);
      currentPkg.devDependencies = updateVersions(currentPkg.devDependencies, dependencies);
      currentPkg.peerDependencies = updateVersions(currentPkg.peerDependencies, dependencies, '^');

      writePackage(pkgPath, currentPkg);
    });

    await Promise.all(promises);
  },
  /**
   *
   * @param g
   */
  async build(g = gulp) {
    logger(`Starting '${chalk.cyan("repo:clean")}'...`);

    await module.exports.clean(g);

    logger(`Finished '${chalk.cyan("repo:clean")}'`);
    logger(`Starting '${chalk.cyan("repo:syncDependencies")}'...`);

    await module.exports.syncDependencies();

    logger(`Finished '${chalk.cyan("repo:syncDependencies")}'...`);
    logger(`Starting '${chalk.cyan("repo:copy")}'...`);

    await module.exports.copy(g);

    logger(`Finished '${chalk.cyan("repo:copy")}'`);
    logger(`Starting '${chalk.cyan("repo:writePackages")}'...`);

    await module.exports.writePackages(g);

    logger(`Finished '${chalk.cyan("repo:writePackages")}'`);
  },
  /**
   *
   * @returns {Promise<void | never>}
   * @param g
   */
  async copy(g = gulp) {
    const {version} = await readPackage();
    const packages = findPackages().join(",");

    const stream = g
      .src([
        `${packagesDir}/{${packages}}/**`,
        `${packagesDir}/{${packages}}/.npmignore`,
        `!${packagesDir}/*/tsconfig.compile.json`,
        `!${packagesDir}/*/src/**`,
        `!${packagesDir}/*/test/**`,
        `!${packagesDir}/*/package-lock.json`,
        `!${packagesDir}/*/yarn.lock`,
        `!${packagesDir}/*/node_modules/**`
      ], {base: packagesDir})
      .pipe(replace(versionPlaceholder, version))
      .pipe(g.dest(`./${path.join(outputDir)}`));

    return toPromise(stream);
  },
  /**
   *
   * @returns {Promise<any | never>}
   * @param g
   */
  async writePackages(g = gulp) {
    const repoPkg = await readPackage();

    const streams = findPackages().map(pkgName => {
      logger("Write package.json", chalk.cyan(`'${npmScope}/${pkgName}'`));

      return g
        .src([`${outputDir}/${pkgName}/package.json`])
        .pipe(jeditor(pkgTemplate(pkgName, repoPkg)))
        .pipe(g.dest(`${outputDir}/${pkgName}`));
    });

    return all(...streams);
  },

  /**
   *
   */
  async publishDryRun() {
    findPackages().map(pkgName => {
      logger("Publish package", chalk.cyan(`'${npmScope}/${pkgName}'`));
      const cwd = `./${path.join(outputDir, pkgName)}`;

      try {
        sync("npm", ["pack"], {
          cwd,
          stdio: "inherit"
        });
      } catch (er) {
        logger(chalk.red(er.message), chalk.red(er.stack));
      }

      return undefined;
    });
  },
  /**
   *
   */
  publish() {
    findPackages()
      .map(pkgName => {
        logger("Publish package", chalk.cyan(`'${npmScope}/${pkgName}'`));
        const cwd = `./${path.join(outputDir, pkgName)}`;

        try {
          const npmrc = path.join(cwd, ".npmrc");
          const registry = "https://registry.npmjs.org/";
          fs.writeFileSync(npmrc, "//registry.npmjs.org/:_authToken=${NPM_TOKEN}", {encoding: "utf8"});

          sync("npm",
            [
              "publish",
              "--userconfig", npmrc,
              "--access", npmAccess,
              "--registry", registry
            ],
            {
              cwd,
              stdio: ["inherit", "inherit", "inherit"]
            });
        } catch (er) {
          logger(chalk.red(er.message), chalk.red(er.stack));
        }

        return undefined;
      });

    return Promise.resolve();
  }
};
