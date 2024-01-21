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
      statements: 99.2,
      branches: 86.59,
      functions: 100,
      lines: 99.2
    }
  }
};
