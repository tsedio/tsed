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
        statements: 53.17,
        branches: 80,
        functions: 75,
        lines: 53.17
      }
    }
  }
});
