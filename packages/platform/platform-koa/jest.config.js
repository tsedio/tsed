// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "^@tsed/platform-koa$": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 99.48,
      branches: 94.5,
      functions: 100,
      lines: 99.48
    }
  }
};
