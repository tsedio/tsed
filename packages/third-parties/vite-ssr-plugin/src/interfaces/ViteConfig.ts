import {InlineConfig} from "vite";

export interface ViteConfig extends InlineConfig {
  stateSnapshot?(): unknown;
}
