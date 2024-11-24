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
        exclude:[
          ...presets.test.coverage.exclude,
          "src/decorators/view.ts",
        ],
        thresholds: {
          statements: 91.3,
          branches: 94.73,
          functions: 76.92,
          lines: 91.3
        }
      }
    }
  }
);
