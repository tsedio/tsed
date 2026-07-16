import {defineConfig} from "vitest/config";
// @ts-ignore
import {presets} from "@tsed/vitest/presets";

export default defineConfig({
  ...presets,
  test: {
    ...presets.test,
    coverage: {
      ...presets.test.coverage,
      thresholds: {
        statements: 68,
        branches: 87,
        functions: 59,
        lines: 68
      }
    }
  }
});
