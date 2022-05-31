// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "di"),
  coverageThreshold: {
    global: {
      statements: 97.95,
      branches: 89.65,
      functions: 96.04,
      lines: 98.17
    }
  }
};
