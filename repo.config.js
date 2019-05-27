module.exports = {
  npmScope: "@tsed",
  npmAccess: "public",
  versionPlaceholder: "0.0.0-PLACEHOLDER",
  packagesDir: "./packages",
  outputDir: "./dist",

  pkgTemplate: (pkgName, {repository, bugs, author, license, gitHead, contributors}) => ({
    main: "lib/index.js",
    typings: "lib/index.d.ts",
    repository,
    bugs,
    homepage: `https://github.com/TypedProject/ts-express-decorators/src/${pkgName}`,
    author,
    contributors,
    license,
    gitHead
  }),

  doc: {
    publish: true,
    url: "https://github.com/TypedProject/v4.tsed.io.git",
    branch: "master",
    cname: "v4.tsed.io"
  },

  tsdoc: {
    rootDir: process.cwd(),
    packagesDir: "packages/",
    scanPatterns: [
      "<rootDir>/packages/**/**/*.d.ts",
      "!node_modules"
    ],
    outputDir: "<rootDir>/docs/api",
    baseUrl: "/api",
    jsonOutputDir: "<rootDir>/docs/.vuepress/public",
    scope: "@tsed",
    modules: {
      "core": "core",
      "di": "di",
      "common": {
        "config": "common/config",
        "converters": "common/converters",
        "filters": "common/filters",
        "jsonschema": "common/jsonschema",
        "mvc": "common/mvc",
        "interceptors": "common/interceptors",
        "server": "common/server"
      },
      "ajv": "ajv",
      "mongoose": "mongoose",
      "typeorm": "typeorm",
      "multipartfiles": "multipartfiles",
      "servestatic": "servestatic",
      "socketio": "socketio",
      "swagger": "swagger",
      "testing": "testing"
    }
  }
};
