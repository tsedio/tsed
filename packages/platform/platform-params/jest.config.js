// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 89.89,
      branches: 73.19,
      functions: 73.83,
      lines: 89.43
    }
  }
};
