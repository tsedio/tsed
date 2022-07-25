// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "di"),
  coverageThreshold: {
    global: {
      statements: 98.3,
      branches: 92.63,
      functions: 96.44,
      lines: 98.39
    }
  }
};
