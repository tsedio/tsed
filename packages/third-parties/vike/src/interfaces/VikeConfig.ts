import type {Options} from "sirv";
import type {InlineConfig} from "vite";

export interface VikeConfig extends InlineConfig {
  enableStream?: boolean;
  statics?: Omit<Options, "dev">;
  stateSnapshot?(): unknown;
}
