// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/passport": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 99.18,
      branches: 86.31,
      functions: 100,
      lines: 99.18
    }
  }
};
