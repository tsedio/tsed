// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "mongoose"),
  coverageThreshold: {
    global: {
      statements: 99.25,
      branches: 94.87,
      functions: 98.97,
      lines: 99.22
    }
  }
};
