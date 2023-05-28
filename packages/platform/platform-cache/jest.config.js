// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/platform-cache": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      branches: 94.11,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
