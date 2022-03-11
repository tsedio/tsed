// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "schema"),
  coverageThreshold: {
    global: {
      statements: 99.74,
      branches: 91.15,
      functions: 99.54,
      lines: 99.87
    }
  }
};
