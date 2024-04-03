// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 92,
      functions: 100,
      lines: 100
    }
  }
};
