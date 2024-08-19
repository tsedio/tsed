import swc from "unplugin-swc";
import {defineConfig} from "vitest/config";
import {resolveWorkspaceFiles} from "../plugins/resolveWorkspaceFiles.js";
import {alias} from "./alias.js";

export const presets = defineConfig({
  resolve: {
    alias
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "json", "html"],
      all: true,
      include: ["src/**/*.{tsx,ts}"],
      exclude: [
        "**/*.spec.{ts,tsx}",
        "**/*.stories.{ts,tsx}",
        "**/*.d.ts",
        "**/__mocks__/**",
        "**/__mock__/**",
        "**/tests/**",
        "**/index.ts"
      ]
    }
  },
  plugins: [
    resolveWorkspaceFiles(),
    swc.vite({
      //tsconfigFile: "./tsconfig.spec.json",
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: {type: "es6"}
    })
  ]
});
