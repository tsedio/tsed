import {defineConfig} from "vitest/config";
// @ts-ignore
import {presets} from "@tsed/vitest/presets";

export default defineConfig({
  ...presets,
  test: {
    ...presets.test,
    // @ts-ignore
    globalSetup: ["../../testcontainers/mongo/src/setup/vi.setup.ts"],
    coverage: {
      ...presets.test.coverage,
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0
      }
    }
  }
});
