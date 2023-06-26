// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.85,
      branches: 94.4,
      functions: 95.63,
      lines: 98.85
    }
  }
};
