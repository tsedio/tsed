// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 97.52,
      branches: 92.65,
      functions: 95.41,
      lines: 97.52
    }
  }
};
