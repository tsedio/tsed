// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "typeorm"),
  coverageThreshold: {
    global: {
      branches: 71.43,
      functions: 100,
      lines: 94.62,
      statements: 96.49
    }
  }
};
