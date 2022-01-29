// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "mikro-orm"),
  coverageThreshold: {
    global: {
      branches: 90.91,
      functions: 96.97,
      lines: 99.06,
      statements: 98.54
    }
  }
};
