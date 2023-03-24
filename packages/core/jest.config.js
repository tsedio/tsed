// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.43,
      branches: 90.67,
      functions: 94.84,
      lines: 98.68
    }
  }
};
