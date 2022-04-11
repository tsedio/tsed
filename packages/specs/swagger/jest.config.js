// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "swagger"),
  coverageThreshold: {
    global: {
      statements: 98.27,
      branches: 80,
      functions: 96.66,
      lines: 98.19
    }
  }
};
