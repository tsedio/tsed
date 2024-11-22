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
          statements: 96.88,
          branches: 95.5,
          functions: 94.11,
          lines: 96.88
        }
      }
    }
  }
);