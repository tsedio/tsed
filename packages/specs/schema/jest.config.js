// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "schema"),
  coverageThreshold: {
    global: {
      statements: 99.67,
      branches: 91.32,
      functions: 99.51,
      lines: 99.81
    }
  }
};
