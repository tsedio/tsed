import {defineConfig} from "vite";
import {join} from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    outDir: "lib/browser",
    lib: {
      entry: join(import.meta.dirname, "src/common/index.ts"),
      formats: ["umd"],
      name: "@tsed/di",
      fileName: "di"
    },
    rollupOptions: {
      external: /node_modules\/(.*)/
    }
  }
});
