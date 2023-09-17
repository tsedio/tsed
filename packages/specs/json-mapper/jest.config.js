// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 99.53,
      branches: 97.46,
      functions: 100,
      lines: 99.53
    }
  },
  moduleNameMapper: {
    "@tsed/json-mapper": "<rootDir>/src/index.ts"
  }
};
