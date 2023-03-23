// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 87.5,
      functions: 80,
      lines: 92,
      statements: 92.3
    }
  }
};
