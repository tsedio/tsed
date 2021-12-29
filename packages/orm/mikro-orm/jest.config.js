// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "mikro-orm"),
  coverageThreshold: {
    global: {
      branches: 90.91,
      functions: 100,
      lines: 99.06,
      statements: 99.21
    }
  }
};
