// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.86,
      branches: 96.69,
      lines: 98.86,
      functions: 98.72
    }
  }
};
