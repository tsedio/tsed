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
      branches: 88.37,
      functions: 96.55,
      lines: 100
    }
  }
};
