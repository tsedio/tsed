module.exports = {
  rootDir: process.cwd(),
  packagesDir: "packages/",
  scanPatterns: [
    "<rootDir>/packages/**/lib/**/*.d.ts",
    "!<rootDir>/packages/**/lib/**/data/*.ts",
    "!<rootDir>/packages/seq",
    "!<rootDir>/packages/test-artillery",
    "!<rootDir>/packages/servestatic",
    "!<rootDir>/packages/testing/{bootstrap,inject,invoke,loadInjector}.ts",
    "!<rootDir>/packages/integration",
    "!<rootDir>/packages/integration-express",
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
    "exceptions": "exceptions",
    "ajv": "ajv",
    "mongoose": "mongoose",
    "multipartfiles": "multipartfiles",
    "passport": "passport",
    "servestatic": "servestatic",
    "socketio": "socketio",
    "swagger": "swagger",
    "typeorm": "typeorm",
    "testing": "testing"
  }
};
