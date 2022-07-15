// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "root"),
  coverageThreshold: {
    global: {
      statements: 99.26,
      branches: 91.16,
      functions: 99.08,
      lines: 99.28
    }
  }
};
