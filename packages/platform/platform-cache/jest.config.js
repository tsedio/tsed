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
      branches: 93.04,
      functions: 100,
      lines: 99.33,
      statements: 99.33
    }
  }
};
