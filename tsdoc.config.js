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
    "!**/common/src/utils/**",
    "!**/common/src/constants/**",
    "!**/jsonschema/**",
    "!<rootDir>/packages/*/src",
    "!<rootDir>/packages/**/constants",
    "!<rootDir>/packages/**/registries",
    "!<rootDir>/packages/**/platform/utils",
    "!<rootDir>/packages/orm/adapters",
    "!<rootDir>/packages/orm/adapters-redis",
    "!<rootDir>/packages/platform/platform-aws/{components,constants,pipes}",
    "!<rootDir>/packages/third-parties/seq",
    "!<rootDir>/packages/third-parties/formio",
    ...ignores("<rootDir>/packages/specs/ajv/**", ["interfaces", "services"]),
    ...ignores("<rootDir>/packages/security/oidc-provider/**", ["constants", "middlewares", "services", "utils"]),
    ...ignores("<rootDir>/packages/third-parties/stripe/**", ["constants", "middlewares", "services"]),
    ...ignores("<rootDir>/packages/specs/swagger/**", ["middlewares", "services", "utils"]),
    ...ignores("<rootDir>/packages/platform/platform-express/**", ["components", "middlewares", "services"]),
    ...ignores("<rootDir>/packages/platform/platform-koa/**", ["components", "middlewares", "services"]),
    ...ignores("!<rootDir>/packages/graphql/**", ["registries", "services"]),
    ...ignores("<rootDir>/packages/orm/objection/**", ["registries", "services", "utils"]),
    ...ignores("!<rootDir>/packages/orm/mongoose/**", ["utils"]),
    "!<rootDir>/packages/specs/swagger/*/SwaggerModule.ts",
    "!<rootDir>/packages/security/oidc-provider/*/OidcModule.ts",
    "!<rootDir>/packages/platform/platform-test-utils",
    "!**/node_modules"
  ],
  outputDir: "<rootDir>/docs/api",
  baseUrl: "/api",
  jsonOutputDir: "<rootDir>/docs/.vuepress/public",
  scope: "@tsed",
  modules: {
    core: "core",
    di: "di",
    schema: "schema",
    openspec: "openspec",
    common: "common",
    exceptions: "exceptions",
    ajv: "ajv",
    mongoose: "mongoose",
    passport: "passport",
    socketio: "socketio",
    swagger: "swagger",
    typeorm: "typeorm",
    testing: "testing"
  }
};
