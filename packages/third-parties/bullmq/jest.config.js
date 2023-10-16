module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 80.64,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
