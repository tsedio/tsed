import type {InlineConfig} from "vite";
import {Options} from "sirv";

export type ViteConfig = InlineConfig & {
  enableStream?: boolean;
  statics?: Omit<Options, "dev">;
  stateSnapshot?(): unknown;
};
