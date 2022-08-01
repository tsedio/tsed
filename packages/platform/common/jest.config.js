// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "common"),
  coverageThreshold: {
    global: {
      statements: 95.22,
      branches: 80.37,
      functions: 93.62,
      lines: 95.71
    }
  }
};
