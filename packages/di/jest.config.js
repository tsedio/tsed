// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "di"),
  coverageThreshold: {
    global: {
      statements: 98.34,
      branches: 92.13,
      functions: 96.45,
      lines: 98.42
    }
  }
};
