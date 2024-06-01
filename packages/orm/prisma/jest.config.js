// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      statements: 98.65,
      branches: 91.61,
      functions: 96.96,
      lines: 98.65
    }
  }
};
