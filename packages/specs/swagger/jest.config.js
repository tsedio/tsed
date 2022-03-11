// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "swagger"),
  coverageThreshold: {
    global: {
      statements: 99.82,
      branches: 91.81,
      functions: 99.53,
      lines: 99.95
    }
  }
};
