// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 81.91,
      branches: 76.19,
      functions: 80,
      lines: 81.91
    }
  },
  transformIgnorePatterns: ["test/workflows/.*\\.ts$"],
  moduleNameMapper: {
    "@tsed/temporal": "<rootDir>/src/index.ts"
  }
};
