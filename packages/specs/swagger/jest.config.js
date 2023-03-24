// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/swagger": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 88.73,
      functions: 100,
      lines: 100
    }
  }
};
