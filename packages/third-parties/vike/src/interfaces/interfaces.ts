import {ViteConfig} from "./ViteConfig.js";

declare global {
  namespace TsED {
    interface Configuration {
      vite: ViteConfig;
    }
  }
}
