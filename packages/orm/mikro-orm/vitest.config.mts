// @ts-ignore
import {presets} from "@tsed/vitest/presets";
import {defineConfig} from "vitest/config";

export default defineConfig(
  {
    ...presets,
    test: {
      ...presets.test,
      // @ts-ignore
      globalSetup: [
        "../testcontainers-mongo/src/setup/vi.setup.ts"
      ],
      coverage: {
        ...presets.test.coverage,
        thresholds: {
          statements: 97.78,
          branches: 97.43,
          functions: 100,
          lines: 97.78
        }
      }
    }
  }
);
