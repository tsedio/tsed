// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 71.05,
      functions: 84.31,
      lines: 91.78,
      statements: 91.55
    }
  }
};
