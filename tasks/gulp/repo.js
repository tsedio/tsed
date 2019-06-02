/* eslint-disable global-require,no-template-curly-in-string */
const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const logger = require("fancy-log");
const replace = require("gulp-replace");
const clean = require("gulp-clean");
const glob = require("glob");
const readPackageJson = require("read-package-json");
const jeditor = require("gulp-json-editor");
const {sync} = require("execa");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");

const all = require("./utils/all");

const {outputDir, typescript, packagesDir, pkgTemplate, npmAccess, npmScope, ignorePublishPackages = [], versionPlaceholder, projectsDir} = require("../../repo.config");

const TS_PROJECTS = new Map();
const STORE_CONFIG = ["core", "common", "di", "passport"];
/**
 *
 * @returns {Promise<any>}
 */
const readPackage = () =>
  new Promise(resolve => {
    readPackageJson("./package.json", console.error, null, (er, data) => resolve(data));
  });
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
/**
 *
 * @returns {*}
 */
const findPackages = () => {
  const pkgs = glob.sync("*/package.json", {
    cwd: packagesDir
  });

  return pkgs.map((pkg) => pkg.split("/")[0]);
};

const findIntegrationProjects = () => {
  const projects = glob.sync("*", {
    cwd: projectsDir
  });

  return projects.map((project) => project.split("/")[0]);
};

const getTsProject = (pkgName) => {
  if (!TS_PROJECTS.has(pkgName)) {
    const tsProject = ts.createProject("./tsconfig.json", {
      "declaration": true,
      "noResolve": false,
      "preserveConstEnums": true,
      "sourceMap": true,
      "noEmit": false
    });

    if (STORE_CONFIG.indexOf(pkgName) === -1) {
      return tsProject;
    }
    TS_PROJECTS.set(pkgName, tsProject);
  }

  return TS_PROJECTS.get(pkgName);
};

const compile = async (pkgName) => {
  const {version} = await readPackage();
  const tsProject = getTsProject(pkgName);

  const stream = gulp
    .src([`${packagesDir}/${pkgName}/src/**/*.ts`])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write(".", {sourceRoot: "../src"}))
    .pipe(replace(versionPlaceholder, version))
    .pipe(gulp.dest(`${outputDir}/${pkgName}/lib`));

  return toPromise(stream);
};

module.exports = {
  /**
   *
   * @param g
   */
  async clean(g = gulp) {
    const stream = g.src(outputDir, {read: false, allowEmpty: true}).pipe(clean());

    return toPromise(stream);
  },
  /**
   *
   */
  async bootstrap() {
    findPackages()
      .filter((packageName) => packageName !== "legacy")
      .map(pkgName => {
        logger("Mount package", chalk.cyan(`'${pkgName}'`));

        if (typescript) {
          // sync("yarn", ["install"], {
          //   stdio: "inherit",
          //   cwd: `./${path.join(packagesDir, pkgName)}`
          // });
          return;
        }

        sync("npm", ["link", `./${path.join(packagesDir, pkgName)}`], {
          stdio: "inherit"
        });

        return undefined;
      });
  },

  /**
   *
   * @param g
   */
  async build(g = gulp) {
    logger(`Starting '${chalk.cyan("repo:clean")}'...`);

    await module.exports.clean(g);

    logger(`Finished '${chalk.cyan("repo:clean")}'`);

    if (fs.existsSync("./tsconfig.json")) {
      logger(`Starting '${chalk.cyan("repo:compile")}'...`);

      await module.exports.compile(g);

      logger(`Finished '${chalk.cyan("repo:compile")}'`);
    }

    logger(`Starting '${chalk.cyan("repo:copy")}'...`);

    await module.exports.copy(g);

    logger(`Finished '${chalk.cyan("repo:copy")}'`);
    logger(`Starting '${chalk.cyan("repo:writePackages")}'...`);

    await module.exports.writePackages(g);

    logger(`Finished '${chalk.cyan("repo:writePackages")}'`);
  },

  async compile(g = gulp) {
    const packages = findPackages();
    const promises = packages.map(async (pkgName) => {
      logger("Compile package", chalk.cyan(`'${npmScope}/${pkgName}'`) + "...");
      await compile(pkgName);
      logger("Finished compile package", chalk.cyan(`'${npmScope}/${pkgName}'`));
    });

    return Promise.all(promises);
  },

  async watch() {
    return new Promise(async () => {
      const packages = findPackages();
      const projects = findIntegrationProjects();

      await module.exports.compile();

      projects.forEach((projectDir) => {
        gulp.src(`${packagesDir}/**/*`).pipe(gulp.dest(`${projectsDir}/${projectDir}/node_modules/${npmScope}`));
      });

      packages.map(pkgName => {
        gulp
          .watch(`${packagesDir}/${pkgName}/src/**/*.ts`)
          .on("change", async (tsFile) => {
            logger("Compile file", chalk.cyan(`'${tsFile}'`) + "...");
            await compile(pkgName);

            const jsFile = tsFile.replace("src/", "lib/").replace(".ts", ".js");

            projects.forEach((projectDir) => {
              const dest = `${projectsDir}/${projectDir}/node_modules/${npmScope}/${pkgName}`;
              gulp.src(tsFile).pipe(gulp.dest(`${dest}/src`));
              gulp.src(jsFile).pipe(gulp.dest(`${dest}/lib`));
            });

            logger("Finished compile file", chalk.cyan(`'${tsFile}'`));
          });
      });
    });
  },
  /**
   *
   * @returns {Promise<void | never>}
   * @param g
   */
  async copy(g = gulp) {
    const {version} = await readPackage();

    const stream = g
      .src([
        `${packagesDir}/**`,
        `${packagesDir}/**/.npmignore`,
        `!${packagesDir}/**/src/**/*.{js,js.map,d.ts}`,
        `!${packagesDir}/**/package-lock.json`,
        `!${packagesDir}/**/yarn.lock`,
        `!${packagesDir}/**/node_modules/**`
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
  async dryRun() {
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
      .filter(pkgName => ignorePublishPackages.indexOf(pkgName) === -1)
      .map(pkgName => {
        logger("Publish package", chalk.cyan(`'${npmScope}/${pkgName}'`));
        const cwd = `./${path.join(outputDir, pkgName)}`;

        try {
          const npmrc = `./${path.join(cwd, ".npmrc")}`;
          fs.writeFileSync(npmrc, "//registry.npmjs.org/:_authToken=${NPM_TOKEN}", {encode: "utf8"});

          sync("npm", ["publish", "--access", npmAccess], {
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


findPackages().forEach((pkgName) => {
  module.exports[`compile:${pkgName}`] = () => compile(pkgName);
  module.exports[`compileProjects:${pkgName}`] = () => compile(pkgName, true);
});
