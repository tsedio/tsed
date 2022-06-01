// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-response-filter"),
  coverageThreshold: {
    global: {
      statements: 96.47,
      branches: 84,
      functions: 89.47,
      lines: 96.25
    }
  }
};
