const {readPackage} = require("./readPackage");
const {outputDir, packagesDir, ignorePublishPackages = [], versionPlaceholder} = require("../../../repo.config");
const gulp = require("gulp");
const replace = require("gulp-replace");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const {toPromise} = require("./toPromise");
const TS_PROJECTS = new Map();
const STORE_CONFIG = ["core", "common", "di", "passport"];

exports.getTsProject = (pkgName) => {
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

exports.compile = async (pkgName) => {
  const {version} = await readPackage();
  const tsProject = exports.getTsProject(pkgName);

  const stream = gulp
    .src([`${packagesDir}/${pkgName}/src/**/*.ts`])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write(".", {sourceRoot: "../src"}))
    .pipe(replace(versionPlaceholder, version))
    .pipe(gulp.dest(`${outputDir}/${pkgName}/lib`));

  return toPromise(stream);
};
