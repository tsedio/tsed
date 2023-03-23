// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config"),
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleNameMapper: {
    "@tsed/typeorm": "<rootDir>/src/index.ts"
  },
  coverageThreshold: {
    global: {
      statements: 96.49,
      branches: 76.92,
      functions: 94.44,
      lines: 96.29
    }
  }
};
