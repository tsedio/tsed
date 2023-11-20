module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 83.78,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
