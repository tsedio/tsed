import {InlineConfig} from "vite";

export interface ViteConfig extends InlineConfig {
  enableStream?: boolean;
  stateSnapshot?(): unknown;
}
