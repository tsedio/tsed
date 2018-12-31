module.exports = {
  npmScope: "@tsed",
  npmAccess: "public",
  versionPlaceholder: "0.0.0-PLACEHOLDER",
  packagesDir: "./packages",
  outputDir: "./dist",
  typescript: true,

  pkgTemplate: (pkgName, {repository, bugs, author, license, gitHead, contributors}) => (json) => {

    Object.keys(json.peerDependencies).forEach((key) => {
      if (key.match(/@tsed/)) {
        json.dependencies[key] = json.peerDependencies[key];
        delete json.peerDependencies[key];
      }
    });

    Object.assign(json, {
      main: "lib/index.js",
      typings: "lib/index.d.ts",
      repository,
      bugs,
      homepage: `https://github.com/Romakita/ts-express-decorators/src/${pkgName}`,
      author,
      contributors,
      license,
      gitHead
    });

    return json;
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
