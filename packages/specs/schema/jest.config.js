// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "schema"),
  coverageThreshold: {
    global: {
      statements: 98.61,
      branches: 89.91,
      functions: 99.28,
      lines: 98.74
    }
  }
};
