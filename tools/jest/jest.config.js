// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  roots: ["<rootDir>/src"],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageProvider: "v8",
  coverageDirectory: "coverage",
  coverageReporters: ["clover", "json", "lcov", "text", "json-summary"],
  // moduleDirectories: ["node_modules", "packages"],
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "index.ts",
    "/lib",
    "/node_modules/",
    "/test/",
    "exports.ts",
    "__mock__",
    "platform-test-utils",
    "engines",
    "FakeAdapter",
    "PlatformTest"
  ],
  //  modulePathIgnorePatterns: ["<rootDir>/lib", "<rootDir>/dist"], // An object that configures minimum threshold enforcement for coverage results
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "/docs/", "/docs-references/", "/engines/"],
  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", require("./swc.node.json")]
  },

  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$", "^.+\\.module\\.(css|sass|scss)$"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {},
  moduleFileExtensions: [
    // Place tsx and ts to beginning as suggestion from Jest team
    // https://jestjs.io/docs/configuration#modulefileextensions-arraystring
    "tsx",
    "ts",
    "js",
    "json",
    "jsx",
    "node"
  ],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  reporters: ["default"],
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true
  }
};
