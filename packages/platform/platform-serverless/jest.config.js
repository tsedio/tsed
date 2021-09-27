// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-serverless"),
  coverageThreshold: {
    global: {
      branches: 75.56,
      functions: 87.76,
      lines: 94.37,
      statements: 94.1
    }
  }
};
