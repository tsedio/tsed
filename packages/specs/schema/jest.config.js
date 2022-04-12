// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "schema"),
  coverageThreshold: {
    global: {
      statements: 98.68,
      branches: 89.91,
      functions: 99.54,
      lines: 98.77
    }
  }
};
