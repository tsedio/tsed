module.exports = {
  rootDir: process.cwd(),
  packagesDir: "packages/",
  scanPatterns: [
    "<rootDir>/packages/**/lib/**/*.d.ts",
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
};
