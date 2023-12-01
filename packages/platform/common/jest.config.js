// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "^@tsed/common$": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 98.24,
      branches: 90.69,
      functions: 97.08,
      lines: 98.24
    }
  }
};
