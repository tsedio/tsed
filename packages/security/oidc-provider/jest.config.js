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
    global: require("./coverage.json")
  }
};
