// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "oidc-provider"),
  coverageThreshold: {
    global: {
      statements: 98.68,
      branches: 90.14,
      functions: 98.61,
      lines: 99.66
    }
  }
};
