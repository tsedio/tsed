// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "mongoose"),
  coverageThreshold: {
    global: {
      branches: 94.67,
      functions: 98.9,
      lines: 98.9,
      statements: 98.93
    }
  }
};
