// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/stripe": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 71.42,
      functions: 83.33,
      lines: 100
    }
  }
};
