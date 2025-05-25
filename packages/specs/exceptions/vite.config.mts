import {defineConfig} from "vite";
import {join} from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    outDir: "lib/browser",
    lib: {
      entry: join(import.meta.dirname, "src/index.ts"),
      formats: ["umd"],
      name: "@tsed/exceptions",
      fileName: "exceptions"
    },
    rollupOptions: {
      // external: /node_modules\/(.*)/
    }
  }
});
