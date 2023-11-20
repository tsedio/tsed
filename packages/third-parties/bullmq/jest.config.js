module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 87.17,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
