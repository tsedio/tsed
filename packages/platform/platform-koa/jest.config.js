// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-koa"),
  coverageThreshold: {
    global: {
      statements: 98.99,
      branches: 85.45,
      functions: 100,
      lines: 98.97
    }
  }
};
