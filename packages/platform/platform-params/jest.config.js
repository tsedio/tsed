// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 94.97,
      branches: 88.77,
      functions: 94.33,
      lines: 94.97
    }
  }
};
