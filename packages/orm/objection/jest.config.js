// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/objection": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      branches: 68.75,
      functions: 81.48,
      lines: 92.44,
      statements: 92.86
    }
  }
};
