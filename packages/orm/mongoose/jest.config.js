// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/mongoose": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 99.5,
      branches: 95.48,
      functions: 100,
      lines: 99.47
    }
  }
};
