// @ts-ignore
import {presets} from "@tsed/vitest/presets";
import {mergeConfig, defineConfig} from "vitest/config";

const config = defineConfig({
  test: {
    coverage: {
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0
      }
    }
  }
});

export default mergeConfig(
  presets,
  config
);
