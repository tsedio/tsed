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
      statements: 99.51,
      branches: 93.61,
      functions: 100,
      lines: 99.51
    }
  }
};
