// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const config = require("@tsed/jest-config");

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 99.41,
      branches: 96.07,
      functions: 100,
      lines: 99.41
    }
  },
  moduleNameMapper: {
    ...config.moduleNameMapper,
    "@tsed/schema": "<rootDir>/src/index.ts",
    "@tsed/di": "<rootDir>/../../di/src/index.ts",
    "@tsed/exceptions": "<rootDir>/../exceptions/src/index.ts",
    "@tsed/platform-exceptions": "<rootDir>/../../platform/platform-exceptions/src/index.ts",
    "@tsed/platform-params": "<rootDir>/../../platform/platform-params/src/index.ts",
    "@tsed/platform-middlewares": "<rootDir>/../../platform/platform-middlewares/src/index.ts",
    "@tsed/platform-router": "<rootDir>/../../platform/platform-router/src/index.ts",
    "@tsed/platform-response-filter": "<rootDir>/../../platform/platform-response-filter/src/index.ts",
    "@tsed/platform-log-middleware": "<rootDir>/../../platform/platform-log-middleware/src/index.ts",
    "@tsed/common": "<rootDir>/../../platform/common/src/index.ts",
    "@tsed/json-mapper": "<rootDir>/../json-mapper/src/index.ts"
  },
  setupFiles: ["./test/helpers/setup.ts"]
};
