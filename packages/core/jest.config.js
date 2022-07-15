// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "core"),
  coverageThreshold: {
    global: {
      statements: 97.95,
      branches: 89.59,
      functions: 96.03,
      lines: 98.17
    }
  }
};
