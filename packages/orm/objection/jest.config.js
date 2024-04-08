// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/objection": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      branches: 96.87,
      functions: 91.48,
      lines: 98.26,
      statements: 98.26
    }
  }
};
