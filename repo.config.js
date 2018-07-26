module.exports = {
  npmScope: "@tsed",
  npmAccess: "public",
  versionPlaceholder: "0.0.0-PLACEHOLDER",
  packagesDir: "./packages",
  outputDir: "./dist",

  pkgTemplate: (pkgName, {repository, bugs, author, license, gitHead, contributors}) => ({
    main: "./index.js",
    typings: "./index.d.ts",
    repository,
    bugs,
    homepage: `https://github.com/Romakita/ts-express-decorators/src/${pkgName}`,
    author,
    contributors,
    license,
    gitHead
  })
};
