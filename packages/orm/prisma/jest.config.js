// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  ...require("@tsed/jest-config")(__dirname, "prisma"),
  coverageThreshold: {
    global: {
      branches: 87.22,
      functions: 92.42,
      lines: 96.25,
      statements: 92.42
    }
  }
};
