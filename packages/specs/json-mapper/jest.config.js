// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: require("./coverage.json")
  },
  moduleNameMapper: {
    "@tsed/json-mapper": "<rootDir>/src/index.ts"
  }
};
