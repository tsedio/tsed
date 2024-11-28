// @ts-ignore
import {presets} from "@tsed/vitest/presets";
import {defineConfig} from "vitest/config";

export default defineConfig(
  {
    ...presets,
    test: {
      ...presets.test,
      // @ts-ignore
      globalSetup: [import.meta.resolve("@tsed/testcontainers-mongo/vitest/setup")],
      coverage: {
        ...presets.test.coverage,
        thresholds: {
          statements: 97.95,
          branches: 96.18,
          functions: 100,
          lines: 97.95
        }
      }
    }
  }
);
