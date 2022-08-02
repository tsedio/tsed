// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "di"),
  coverageThreshold: {
    global: {
      statements: 98.35,
      branches: 92.25,
      functions: 96.49,
      lines: 98.43
    }
  }
};
