// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 99.66,
      branches: 97.94,
      functions: 100,
      lines: 99.66
    }
  },
  moduleNameMapper: {
    "@tsed/json-mapper": "<rootDir>/src/index.ts"
  }
};
