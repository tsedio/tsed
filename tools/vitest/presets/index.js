import swc from "unplugin-swc";
import {defineConfig} from "vitest/config";

import {resolveWorkspaceFiles} from "../plugins/resolveWorkspaceFiles.js";
import {alias} from "./alias.js";

export const presets = defineConfig({
  resolve: {
    alias: {
      "@tsed/platform-http/testing": alias["@tsed/platform-http"].replace("common", "testing"),
      ...alias
    }
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      enabled: true,
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
      sourceMaps: "inline",

      jsc: {
        target: "es2022",
        externalHelpers: true,
        keepClassNames: true,
        parser: {
          syntax: "typescript",
          tsx: true,
          decorators: true,
          dynamicImport: true,
          importMeta: true,
          preserveAllComments: true
        },
        transform: {
          useDefineForClassFields: false,
          legacyDecorator: true,
          decoratorMetadata: true
        }
      },
      module: {
        type: "es6",
        strictMode: true,
        lazy: false,
        noInterop: false
      },
      isModule: true
    })
  ]
});
