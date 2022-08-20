// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const {join} = require("path");
const fixPath = require("normalize-path");

const packageDir = join(__dirname, "../../packages");
module.exports = (rootDir) => ({
  rootDir: fixPath(rootDir),
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // moduleDirectories: ["node_modules", "packages"],
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "index.ts",
    "/node_modules/",
    "/test/",
    "exports.ts",
    "__mock__",
    "platform-test-utils",
    "engines",
    "FakeAdapter"
  ],
  moduleNameMapper: {
    "^@tsed/core$": fixPath(join(packageDir, "core/src")),
    "^@tsed/di$": fixPath(join(packageDir, "di/src")),
    "^@tsed/perf$": fixPath(join(packageDir, "perf/src")),
    "^@tsed/engines": fixPath(join(packageDir, "engines/src")),
    "^@tsed/common$": fixPath(join(packageDir, "platform/common/src")),
    "^@tsed/schema$": fixPath(join(packageDir, "specs/schema/src")),
    "^@tsed/ajv$": fixPath(join(packageDir, "specs/ajv/src")),
    "^@tsed/exceptions$": fixPath(join(packageDir, "specs/exceptions/src")),
    "^@tsed/json-mapper$": fixPath(join(packageDir, "specs/json-mapper/src")),
    "^@tsed/openspec$": fixPath(join(packageDir, "specs/openspec/src")),
    "^@tsed/swagger$": fixPath(join(packageDir, "specs/swagger/src")),
    "^@tsed/apollo": fixPath(join(packageDir, "graphql/apollo/src")),
    "^@tsed/typegraphql": fixPath(join(packageDir, "graphql/typegraphql/src")),
    "^@tsed/platform-(.*)$": fixPath(join(packageDir, "platform/platform-$1/src")),
    "^@tsed/testing-mongoose$": fixPath(join(packageDir, "orm/testing-mongoose/src")),
    "^@tsed/objection$": fixPath(join(packageDir, "orm/objection/src")),
    "^@tsed/engines": fixPath(join(packageDir, "engines/src")),
    "^@tsed/typeorm$": fixPath(join(packageDir, "orm/typeorm/src")),
    "^@tsed/mikro-orm": fixPath(join(packageDir, "orm/mikro-orm/src")),
    "^@tsed/prisma": fixPath(join(packageDir, "orm/prisma/src")),
    "^@tsed/adapters$": fixPath(join(packageDir, "orm/adapters/src")),
    "^@tsed/mongoose$": fixPath(join(packageDir, "orm/mongoose/src")),
    "^@tsed/adapters-redis$": fixPath(join(packageDir, "orm/adapters-redis/src")),
    "^@tsed/agenda$": fixPath(join(packageDir, "third-parties/agenda/src")),
    "^@tsed/components-scan$": fixPath(join(packageDir, "third-parties/components-scan/src")),
    "^@tsed/formio$": fixPath(join(packageDir, "third-parties/formio/src")),
    "^@tsed/formio-types$": fixPath(join(packageDir, "third-parties/formio-types/src")),
    "^@tsed/schema-formio$": fixPath(join(packageDir, "third-parties/schema-formio/src")),
    "^@tsed/terminus$": fixPath(join(packageDir, "third-parties/terminus/src")),
    "^@tsed/stripe$": fixPath(join(packageDir, "third-parties/stripe/src")),
    "^@tsed/socketio$": fixPath(join(packageDir, "third-parties/socketio/src")),
    "^@tsed/socketio-testing$": fixPath(join(packageDir, "third-parties/socketio-testing/src")),
    "^@tsed/passport$": fixPath(join(packageDir, "security/passport/src")),
    "^@tsed/jwks$": fixPath(join(packageDir, "security/jwks/src")),
    "^@tsed/oidc-provider$": fixPath(join(packageDir, "security/oidc-provider/src")),
    "^@tsed/vite-ssr-plugin$": fixPath(join(packageDir, "third-parties/vite-ssr-plugin/src"))
  },
  testPathIgnorePatterns: ["node_modules", "/docs/", "/docs-references/", "/engines/"],
  modulePathIgnorePatterns: ["<rootDir>/lib", "<rootDir>/dist"], // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files

  // A map from regular expressions to paths to transformers
  transform: {
    "\\.(ts)$": "ts-jest"
  },
  preset: "ts-jest",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [],
  reporters: ["default"]
});
