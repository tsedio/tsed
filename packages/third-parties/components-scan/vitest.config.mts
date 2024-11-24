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
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,

        }
      }
    }
  }
);
