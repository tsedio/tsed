// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const config = require("@tsed/jest-config");

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      statements: 99.41,
      branches: 96.07,
      functions: 100,
      lines: 99.41
    }
  },
  setupFiles: ["./test/helpers/setup.ts"]
};
