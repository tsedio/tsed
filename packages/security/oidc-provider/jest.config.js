// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageProvider: "babel",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/oidc-provider": "<rootDir>/src/index.ts"
  },
  transformIgnorePatterns: ["^.+\\.module\\.(css|sass|scss)$"],

  coverageThreshold: {
    global: {
      statements: 99.44,
      branches: 77.39,
      functions: 98.16,
      lines: 99.69
    }
  }
};
