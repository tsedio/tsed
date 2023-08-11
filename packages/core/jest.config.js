// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.99,
      branches: 94.93,
      functions: 95.81,
      lines: 98.99
    }
  }
};
