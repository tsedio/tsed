import {join} from "node:path";

import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import {defineConfig} from "vitest/config";

export const root = join(import.meta.dirname, "../../..");

export const presets = defineConfig({
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
    tsconfigPaths({
      projects: [join(root, "tsconfig.json"), join(root, "tsconfig.spec.json")]
    }),
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
