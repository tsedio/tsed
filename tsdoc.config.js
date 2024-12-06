function ignores(base, list) {
  return list.map((directory) => `!${base}/${directory}`);
}

module.exports = {
  rootDir: process.cwd(),
  packagesDir: "packages/",
  scanPatterns: [
    "<rootDir>/packages/**/lib/types/**/*.d.ts",
    "!<rootDir>/packages/*/src",
    "!**/*.spec.ts",
    "!**/__mock__/**",
    "!**/data/**",
    "!**/__fixtures__/**",
    "!**/fixtures/**",
    "!**/*.spec.ts",
    "!<rootDir>/packages/**/constants",
    "!<rootDir>/packages/**/registries",
    "!<rootDir>/packages/**/lib/**/hooks",
    "!<rootDir>/packages/{di,engines,orm,perf,platform,security,specs,third-parties}/**/utils",
    "!<rootDir>/packages/perf",
    "!<rootDir>/packages/orm/prisma",
    "!<rootDir>/packages/third-parties/components-scan",
    "!<rootDir>/packages/platform/platform-test-sdk",
    "!**/node_modules"
  ],
  outputDir: "<rootDir>/docs/api",
  baseUrl: "/api",
  jsonOutputDir: "<rootDir>/docs/public",
  templatesDir: "<rootDir>/docs/.templates",
  scope: "@tsed",
  modules: {}
};
