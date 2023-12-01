// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.82,
      branches: 96.55,
      lines: 98.82,
      functions: 98.34
    }
  }
};
