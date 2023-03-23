// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 91.35,
      branches: 57.14,
      functions: 100,
      lines: 91.35
    }
  }
};
