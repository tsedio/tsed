// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 99.08,
      branches: 96.79,
      lines: 99.08,
      functions: 99.04
    }
  }
};
