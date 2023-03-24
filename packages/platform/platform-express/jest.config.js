// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "^@tsed/platform-express$": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 98.28,
      branches: 92.59,
      functions: 100,
      lines: 98.28
    }
  }
};
