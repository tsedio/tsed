module.exports = {
  ...require("@tsed/jest-config"),
  coverageThreshold: {
    global: {
      branches: 89.58,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
