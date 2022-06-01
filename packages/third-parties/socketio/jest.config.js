// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "socketio"),
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 93.87,
      functions: 98.95,
      lines: 100
    }
  }
};
