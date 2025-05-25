import {defineConfig} from "vite";
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // dts({
    //   outDir: "lib/browser/types",
    //   include: ["src"],
    //   exclude: ["**/*.spec.{ts,tsx}", "**/*.stories.{ts,tsx}"],
    // })
  ],
  build: {
    outDir: "lib/browser",
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["umd"],
      name: "@tsed/hooks",
      fileName: "hooks",
    },
  }
});
