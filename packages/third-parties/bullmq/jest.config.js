module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 83.33,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
