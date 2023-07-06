// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.81,
      branches: 96.71,
      lines: 98.81,
      functions: 98.32
    }
  }
};
