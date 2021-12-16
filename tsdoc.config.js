function ignores(base, list) {
  return list.map((directory) => `!${base}/${directory}`);
}

module.exports = {
  rootDir: process.cwd(),
  packagesDir: "packages/",
  scanPatterns: [
    "<rootDir>/packages/**/lib/types/**/*.d.ts",
    "!<rootDir>/packages/**/lib/**/data/*.ts",
    "!**/*.spec.ts",
    "!**/common/src/utils/**",
    "!**/common/src/constants/**",
    "!**/*Module.ts",
    "!<rootDir>/packages/*/src",
    "!<rootDir>/packages/**/constants",
    "!<rootDir>/packages/**/registries",
    "!<rootDir>/packages/**/platform/utils",
    "!<rootDir>/packages/orm/adapters",
    "!<rootDir>/packages/orm/adapters-redis",
    "!<rootDir>/packages/third-parties/seq",
    "!<rootDir>/packages/third-parties/formio",
    "!<rootDir>/packages/third-parties/formio-types",
    "!<rootDir>/packages/third-parties/schema-formio",
    "!<rootDir>/packages/utils",
    ...ignores("<rootDir>/packages/specs/ajv/**", ["interfaces", "services"]),
    ...ignores("<rootDir>/packages/security/oidc-provider/**", ["constants", "middlewares", "services", "utils"]),
    ...ignores("<rootDir>/packages/specs/swagger/**", ["middlewares", "services", "utils"]),
    ...ignores("<rootDir>/packages/platform/platform-express/**", ["components", "middlewares"]),
    ...ignores("<rootDir>/packages/platform/platform-koa/**", ["components", "middlewares"]),
    ...ignores("<rootDir>/packages/platform/platform-serverless/**", ["utils"]),
    ...ignores("<rootDir>/packages/platform/platform-aws/**", ["components", "constants", "pipes"]),
    ...ignores("<rootDir>/packages/graphql/**", ["registries", "services"]),
    ...ignores("<rootDir>/packages/orm/objection/**", ["registries", "services", "utils"]),
    ...ignores("<rootDir>/packages/orm/mongoose/**", ["utils"]),
    ...ignores("<rootDir>/packages/third-parties/stripe/**", ["constants", "middlewares", "services"]),
    "!<rootDir>/packages/platform/platform-test-utils",
    "!**/node_modules"
  ],
  outputDir: "<rootDir>/docs/api",
  baseUrl: "/api",
  jsonOutputDir: "<rootDir>/docs/.vuepress/public",
  scope: "@tsed",
  modules: {}
};
