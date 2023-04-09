// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/typegraphql": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 95.3,
      branches: 65.62,
      functions: 94.11,
      lines: 95.3
    }
  }
};
