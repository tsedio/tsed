import {ViteConfig} from "./ViteConfig";

declare global {
  namespace TsED {
    interface Configuration {
      vite: ViteConfig;
    }
  }
}
