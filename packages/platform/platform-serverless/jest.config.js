// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-serverless"),
  coverageThreshold: {
    global: {
      branches: 83.33,
      functions: 98.63,
      lines: 99.28,
      statements: 98.93
    }
  }
};
