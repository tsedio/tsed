// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/adapters": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      branches: 88.6,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
