// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 97.16,
      branches: 92.74,
      lines: 97.16,
      functions: 97.16
    }
  }
};
