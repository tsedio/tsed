module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
