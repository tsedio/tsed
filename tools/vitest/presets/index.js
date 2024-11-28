import swc from "unplugin-swc";
import {defineConfig} from "vitest/config";

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
      include: ["src/**/*.{tsx,ts}"],
      exclude: [
        "**/node_modules/**",
        "**/@tsed/**",
        "**/exports.ts",
        "**/interfaces/**",
        "**/*fixtures.ts",
        "**/fixtures/**",
        "**/__fixtures__/**",
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
    swc.vite({
      sourceMaps: true,
      inlineSourcesContent: true,
      jsc: {
        target: "esnext",
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
      minify: false,
      isModule: true
    })
  ]
});
