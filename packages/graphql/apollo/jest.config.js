// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 94.26,
      branches: 78.26,
      functions: 100,
      lines: 94.26
    }
  }
};
