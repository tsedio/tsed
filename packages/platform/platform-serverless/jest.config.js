// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "^@tsed/platform-serverless$": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 97.95,
      branches: 87.23,
      functions: 100,
      lines: 97.95
    }
  }
};
