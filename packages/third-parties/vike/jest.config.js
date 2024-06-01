// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const config = require("@tsed/jest-config");
module.exports = {
  ...config,
  moduleNameMapper: {
    ...config.moduleNameMapper,
    "@tsed/vike": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0
    }
  }
};
