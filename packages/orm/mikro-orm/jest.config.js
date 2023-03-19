// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      branches: 95.83,
      functions: 94.73,
      lines: 97.43,
      statements: 97.88
    }
  }
};
