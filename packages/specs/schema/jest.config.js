// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "schema"),
  coverageThreshold: {
    global: {
      statements: 99.54,
      branches: 90.52,
      functions: 99.05,
      lines: 99.72
    }
  }
};
