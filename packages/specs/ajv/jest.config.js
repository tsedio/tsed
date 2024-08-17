// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const config = require("@tsed/jest-config");
module.exports = {
  ...config,
  roots: ["<rootDir>/src", "<rootDir>/test"],
  coverageThreshold: {
    global: {
      branches: 95.89,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
