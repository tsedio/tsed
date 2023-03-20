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
      statements: 97.29,
      branches: 100,
      functions: 100,
      lines: 97.14
    }
  }
};
