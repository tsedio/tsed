// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-params"),
  coverageThreshold: {
    global: {
      statements: 89.92,
      branches: 73.83,
      functions: 73.83,
      lines: 89.47
    }
  }
};
