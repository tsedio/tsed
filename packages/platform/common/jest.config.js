// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "common"),
  coverageThreshold: {
    global: {
      statements: 92.13,
      branches: 76.27,
      functions: 88.36,
      lines: 92.29
    }
  }
};
