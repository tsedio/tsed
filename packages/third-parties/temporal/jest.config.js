// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 94.62,
      branches: 70.37,
      functions: 88.88,
      lines: 94.62
    }
  },
  transformIgnorePatterns: ["test/workflows/.*\\.ts$"],
  moduleNameMapper: {
    "@tsed/temporal": "<rootDir>/src/index.ts"
  }
};
