// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 99.27,
      branches: 96.99,
      lines: 99.27,
      functions: 99.17
    }
  }
};
