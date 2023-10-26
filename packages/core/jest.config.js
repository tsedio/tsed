// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.75,
      branches: 94.67,
      functions: 95.41,
      lines: 98.41
    }
  }
};
