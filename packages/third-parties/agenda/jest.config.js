// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "agenda"),
  coverageThreshold: {
    global: {
      statements: 96.96,
      branches: 86.66,
      functions: 100,
      lines: 96.77
    }
  }
};
