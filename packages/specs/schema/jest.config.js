// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0
    }
  },
  moduleNameMapper: {
    "@tsed/schema": "<rootDir>/src/index.ts"
  },
  setupFiles: ["./test/helpers/setup.ts"]
};
