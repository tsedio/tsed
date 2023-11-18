module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 86.48,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
