// eslint-disable-next-line import/no-unresolved
// @ts-ignore
import swc from "unplugin-swc";
import { mergeConfig } from "vitest/config";
import { presets } from "@tsed/vitest/presets"


export default mergeConfig({

  test: {
    globals: true,
    environment: "node",
    env: {},
    outputFile: {
      junit: "./reports/vitest/test-results.xml"
    },
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "json", "html"],
      all: true,
      include: ["src/**/*.{tsx,ts}"],
      exclude: [
        "**/*.spec.{ts,tsx}",
        "**/*.stories.{ts,tsx}",
        "**/*.d.ts",
        "**/__mocks__/**",
        "**/__mock__/**",
        "**/tests/**",
        "**/index.ts"
      ],
      thresholds: {

        statements: 92.55,
        branches: 96.76,
        functions: 96.85,
        lines: 92.55
      }
    }
  },
  plugins: [
    resolveWorkspaceFiles(),
    swc.vite({
      //tsconfigFile: "./tsconfig.spec.json",
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" }
    })
  ]
});
