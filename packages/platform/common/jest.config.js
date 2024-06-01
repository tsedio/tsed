// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const config = require("@tsed/jest-config");

module.exports = {
  ...config,
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    "^@tsed/common$": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 99.03,
      branches: 92.14,
      functions: 97.08,
      lines: 99.03
    }
  }
};
