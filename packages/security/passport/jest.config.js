// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "passport"),
  coverageThreshold: {
    global: {
      statements: 99.36,
      branches: 80,
      functions: 100,
      lines: 99.32
    }
  }
};
