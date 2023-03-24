// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  coverageProvider: "babel",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/oidc-provider": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 99.44,
      branches: 77.87,
      functions: 98.16,
      lines: 99.69
    }
  }
};
