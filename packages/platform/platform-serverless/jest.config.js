// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-serverless"),
  coverageThreshold: {
    global: {
      branches: 84.13,
      functions: 93.33,
      lines: 96.25,
      statements: 95.94
    }
  }
};
