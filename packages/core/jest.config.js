// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 99.17,
      branches: 95.2,
      functions: 97.42,
      lines: 99.17
    }
  }
};
