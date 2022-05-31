// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "di"),
  coverageThreshold: {
    global: {
      statements: 96.67,
      branches: 89.49,
      functions: 93.65,
      lines: 96.68
    }
  }
};
