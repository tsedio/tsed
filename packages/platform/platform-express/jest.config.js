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
      statements: 96.77,
      branches: 84.31,
      functions: 100,
      lines: 96.77
    }
  }
};
