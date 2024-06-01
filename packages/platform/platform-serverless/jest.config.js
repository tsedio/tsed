// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const config = require("@tsed/jest-config");

module.exports = {
  ...config,
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    "^@tsed/platform-serverless$": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91.47,
      functions: 100,
      lines: 98
    }
  }
};
