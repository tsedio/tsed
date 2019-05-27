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
const glob = require("glob");
const {sync} = require("execa");

const {tsdoc, doc, packagesDir} = require("../../repo.config");
const {branch} = require("../../release.config");
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
    await module.exports.bootstrap();
    await buildApi(tsdoc);
  },

  async build() {
    await module.exports.buildApi();

    await execa("vuepress", ["build", "docs"], {stdio: "inherit"});
  },

  async bootstrap() {
    findPackages()
      .filter((packageName) => packageName !== "legacy")
      .map(pkgName => {
        logger("Mount package", chalk.cyan(`'${pkgName}'`));

        sync("npm", ["link", `./${path.join(packagesDir, pkgName)}`], {
          stdio: "inherit"
        });

        return undefined;
      });
  },

  async unlink() {
    findPackages()
      .filter((packageName) => packageName !== "legacy")
      .map(pkgName => {
        logger("Unlink package", chalk.cyan(`'${pkgName}'`));

        sync("npm", ["unlink", `./${path.join(packagesDir, pkgName)}`], {
          stdio: "inherit"
        });

        return undefined;
      });
  },

  async compile() {
    logger(`Starting '${chalk.cyan("docs:compile")}'...`);
    const tsProject = ts.createProject("./tsconfig.json", {
      "declaration": true,
      "noResolve": false,
      "preserveConstEnums": true,
      "noEmit": false
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
    if (doc.publish) {
      const currentBranch = process.env.TRAVIS_BRANCH;

      if (currentBranch !== branch) {
        console.log(
          `This test run was triggered on the branch ${currentBranch}, while docs is configured to only publish from ${
            branch
            }, therefore a new docs version won’t be published.`
        );
        return;
      }

      const pkg = JSON.parse(fs.readFileSync("./package.json", {encoding: "utf8"}));
      const {version} = pkg;
      const {url, cname, branch: branchDoc} = doc;

      const {GH_TOKEN} = process.env;
      const repository = url.replace("https://", "");

      const vuePressPath = "./docs/.vuepress/dist";

      await module.exports.build();

      fs.writeFileSync(`${vuePressPath}/CNAME`, cname, {});

      await execa.shell("git init", {
        cwd: vuePressPath
      });

      await execa.shell("git add -A", {
        cwd: vuePressPath
      });

      await execa.shell(`git commit -m 'Deploy documentation v${version}'`, {
        cwd: vuePressPath
      });

      await execa.shell(`git push -f https://${GH_TOKEN}@${repository} master:${branchDoc}`, {
        cwd: vuePressPath
      });
    }
  }
};
