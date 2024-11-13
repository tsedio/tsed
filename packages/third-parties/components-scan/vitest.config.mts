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
          "**/isTsEnv.ts"
        ],
        thresholds: {
          statements: 100,
          branches: 94.44,
          functions: 100,
          lines: 100,

        }
      }
    }
  }
);
