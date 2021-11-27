// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-serverless"),
  coverageThreshold: {
    global: {
      branches: 83.78,
      functions: 98.94,
      lines: 99.28,
      statements: 98.93
    }
  }
};
