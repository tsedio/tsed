// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "mikro-orm"),
  coverageThreshold: {
    global: {
      branches: 92.1,
      functions: 94.73,
      lines: 97.47,
      statements: 97.91
    }
  }
};
