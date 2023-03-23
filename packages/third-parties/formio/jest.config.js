// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  moduleNameMapper: {
    "@tsed/formio": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 98.49,
      branches: 88.04,
      lines: 98.49,
      functions: 97.91
    }
  }
};
