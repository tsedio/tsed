// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 99.56,
      branches: 97.67,
      functions: 100,
      lines: 99.56
    }
  },
  moduleNameMapper: {
    "@tsed/json-mapper": "<rootDir>/src/index.ts"
  }
};
