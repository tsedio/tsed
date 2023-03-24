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
      statements: 92.25,
      branches: 77.65,
      functions: 88.81,
      lines: 92.24
    }
  }
};
