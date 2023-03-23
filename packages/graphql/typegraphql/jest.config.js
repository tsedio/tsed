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
      statements: 94.96,
      branches: 76.19,
      functions: 95.45,
      lines: 94.96
    }
  }
};
