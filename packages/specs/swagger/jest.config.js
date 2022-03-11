// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "swagger"),
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 83.64,
      functions: 96.67,
      lines: 100
    }
  }
};
