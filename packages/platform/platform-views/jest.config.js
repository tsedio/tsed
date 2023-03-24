// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 86.95,
      functions: 84.61,
      lines: 95.68,
      statements: 95.68
    }
  }
};
