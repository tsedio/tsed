// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "common"),
  coverageThreshold: {
    global: {
      statements: 90.73,
      branches: 73.65,
      functions: 84.27,
      lines: 90.78
    }
  }
};
