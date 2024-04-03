// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 81.81,
      functions: 81.81,
      lines: 95.76,
      statements: 95.76
    }
  }
};
