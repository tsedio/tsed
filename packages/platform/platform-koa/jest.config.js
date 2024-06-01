// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const config = require("@tsed/jest-config");

module.exports = {
  ...config,
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    "^@tsed/platform-koa$": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 99.49,
      branches: 95.87,
      functions: 100,
      lines: 99.49
    }
  }
};
