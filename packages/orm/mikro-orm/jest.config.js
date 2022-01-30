// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "mikro-orm"),
  coverageThreshold: {
    global: {
      branches: 90.38,
      functions: 91.43,
      lines: 96.52,
      statements: 97.1
    }
  }
};
