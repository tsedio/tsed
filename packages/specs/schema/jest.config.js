// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 98.85,
      branches: 91.8,
      functions: 99.59,
      lines: 98.93
    }
  },
  moduleNameMapper: {
    "@tsed/schema": "<rootDir>/src/index.ts"
  },
  setupFiles: ["./test/helpers/setup.ts"]
};
