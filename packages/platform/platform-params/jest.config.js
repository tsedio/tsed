// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 99.81,
      branches: 92.37,
      functions: 100,
      lines: 99.81
    }
  }
};
