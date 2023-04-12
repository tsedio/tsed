// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageProvider: "babel",
  roots: ["<rootDir>/src"],
  moduleNameMapper: {},
  transformIgnorePatterns: ["^.+\\.module\\.(css|sass|scss)$"],

  coverageThreshold: {
    global: {
      statements: 100,
      branches: 87.5,
      functions: 100,
      lines: 100
    }
  }
};
