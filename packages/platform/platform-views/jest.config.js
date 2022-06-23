// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-views"),
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 84.21,
      lines: 93.65,
      statements: 93.93
    }
  }
};
