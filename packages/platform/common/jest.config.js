// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "common"),
  coverageThreshold: {
    global: {
      statements: 90.66,
      branches: 73.86,
      functions: 84.12,
      lines: 90.7
    }
  }
};
