module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 82.85,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
