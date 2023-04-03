// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 99.45,
      branches: 96.14,
      functions: 100,
      lines: 99.45
    }
  },
  moduleNameMapper: {
    "@tsed/schema": "<rootDir>/src/index.ts"
  },
  setupFiles: ["./test/helpers/setup.ts"]
};
