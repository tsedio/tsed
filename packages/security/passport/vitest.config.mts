// @ts-ignore
import {presets} from "@tsed/vitest/presets";
import {defineConfig} from "vitest/config";

export default defineConfig(
  {
    ...presets,
    test: {
      ...presets.test,
      coverage: {
        ...presets.test.coverage,
        thresholds: {
          statements: 98.68,
          branches: 92.3,
          functions: 100,
          lines: 98.68
        }
      }
    }
  }
);