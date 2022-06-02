// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "typeorm"),
  coverageThreshold: {
    global: {
      statements: 96.49,
      branches: 76.92,
      functions: 100,
      lines: 96.29
    }
  }
};
