// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.52,
      branches: 92.95,
      lines: 98.6,
      functions: 98.11
    }
  }
};
