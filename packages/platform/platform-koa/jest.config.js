// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "platform-koa"),
  coverageThreshold: {
    global: {
      statements: 99.44,
      branches: 90.9,
      functions: 100,
      lines: 99.43
    }
  }
};
