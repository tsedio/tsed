// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const config = require("@tsed/jest-config");
module.exports = {
  ...config,
  coverageProvider: "babel",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    "@tsed/oidc-provider": "<rootDir>/src/index.ts"
  },
  transformIgnorePatterns: ["^.+\\.module\\.(css|sass|scss)$"],

  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0
    }
  }
};
