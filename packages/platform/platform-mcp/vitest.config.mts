// @ts-ignore
import {presets} from "@tsed/vitest/presets";
import {defineConfig} from "vitest/config";

export default defineConfig({
  ...presets,
  test: {
    ...presets.test,
    coverage: {
      ...presets.test.coverage,
      exclude: [
        "**/utils/json-schema-to-zod/**",
        "**/node_modules/**",
        "**/@tsed/**",
        "**/exports.ts",
        "**/interfaces/**",
        "**/*fixtures.ts",
        "**/fixtures/**",
        "**/__fixtures__/**",
        "**/*.spec.{ts,tsx}",
        "**/*.stories.{ts,tsx}",
        "**/*.d.ts",
        "**/__mocks__/**",
        "**/__mock__/**",
        "**/tests/**",
        "**/index.ts"
      ],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0
      }
    }
  }
});
