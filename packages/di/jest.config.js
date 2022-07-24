// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "di"),
  coverageThreshold: {
    global: {
      statements: 98.2,
      branches: 91.69,
      functions: 96.44,
      lines: 98.27
    }
  }
};
