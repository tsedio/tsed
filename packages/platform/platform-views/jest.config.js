// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-views"),
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 80,
      lines: 92,
      statements: 92.3
    }
  }
};
