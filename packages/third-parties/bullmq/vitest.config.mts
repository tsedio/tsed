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
        exclude: [
          ...presets.test.coverage.exclude,
          "**/contracts/**/*",
          "**/config/**/*"
        ],
        thresholds: {
          statements: 100,
          branches: 98.38,
          functions: 100,
          lines: 100
        }
      }
    }
  }
);