module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 90.74,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
