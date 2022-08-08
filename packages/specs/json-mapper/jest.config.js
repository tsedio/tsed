// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "json-mapper"),
  coverageThreshold: {
    global: require("./coverage.json")
  }
};
