function ignores(base, list) {
  return list.map((directory) => `!${base}/${directory}`);
}

module.exports = {
  rootDir: process.cwd(),
  packagesDir: "packages/",
  scanPatterns: [
    "<rootDir>/packages/**/lib/**/*.d.ts",
    "!<rootDir>/packages/**/lib/**/data/*.ts",
    "!**/*.spec.ts",
    "!**/mvc/utils/**",
    "!**/mvc/constants/**",
    "!**/jsonschema/**",
    "!<rootDir>/packages/*/src",
    "!<rootDir>/packages/**/constants",
    "!<rootDir>/packages/**/registries",
    "!<rootDir>/packages/**/platform/utils",
    "!<rootDir>/packages/adapters",
    "!<rootDir>/packages/adapters-redis",
    "!<rootDir>/packages/aws/{components,constants,pipes}",
    "!<rootDir>/packages/seq",
    "!<rootDir>/packages/formio",
    ...ignores("<rootDir>/packages/ajv/**", ["interfaces", "services"]),
    ...ignores("<rootDir>/packages/oidc-provider/**", ["constants", "middlewares", "services", "utils"]),
    ...ignores("<rootDir>/packages/objection/**", ["registries", "services", "utils"]),
    ...ignores("<rootDir>/packages/stripe/**", ["constants", "middlewares", "services"]),
    ...ignores("<rootDir>/packages/swagger/**", ["middlewares", "services", "utils"]),
    ...ignores("<rootDir>/packages/platform-express/**", ["components", "middlewares", "services"]),
    ...ignores("<rootDir>/packages/platform-koa/**", ["components", "middlewares", "services"]),
    ...ignores("!<rootDir>/packages/graphql/**", ["registries", "services"]),
    ...ignores("!<rootDir>/packages/mongoose/**", ["utils"]),
    "!<rootDir>/packages/swagger/*/SwaggerModule.ts",
    "!<rootDir>/packages/oidc-provider/*/OidcModule.ts",
    "!<rootDir>/packages/testing",
    "!<rootDir>/packages/platform-test-utils",
    "!**/node_modules"
  ],
  outputDir: "<rootDir>/docs/api",
  baseUrl: "/api",
  jsonOutputDir: "<rootDir>/docs/.vuepress/public",
  scope: "@tsed",
  modules: {
    core: "core",
    di: "di",
    common: "common",
    exceptions: "exceptions",
    ajv: "ajv",
    mongoose: "mongoose",
    multipartfiles: "multipartfiles",
    passport: "passport",
    servestatic: "servestatic",
    socketio: "socketio",
    swagger: "swagger",
    typeorm: "typeorm",
    testing: "testing"
  }
};
