// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/ajv": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      branches: 86.88,
      functions: 100,
      lines: 99.71,
      statements: 99.71
    }
  }
};
