module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 94.66,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
