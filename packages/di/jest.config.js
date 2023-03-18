// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.62,
      branches: 96.49,
      lines: 98.62,
      functions: 98.71
    }
  }
};
