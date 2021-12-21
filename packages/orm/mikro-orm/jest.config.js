// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "mikro-orm"),
  coverageThreshold: {
    global: {
      branches: 85.29,
      functions: 100,
      lines: 98.95,
      statements: 99.15
    }
  }
};
