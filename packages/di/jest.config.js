// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "di"),
  coverageThreshold: {
    global: {
      statements: 99.23,
      branches: 92.91,
      functions: 99.23,
      lines: 99.34
    }
  }
};
