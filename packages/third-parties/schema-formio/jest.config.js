// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/schema-formio": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 99.74,
      branches: 98.88,
      functions: 88.88,
      lines: 99.74
    }
  }
};
