import {Options} from "sirv";
// @ts-ignore
import type {InlineConfig} from "vite";

export type ViteConfig = InlineConfig & {
  enableStream?: boolean;
  statics?: Omit<Options, "dev">;
  stateSnapshot?(): unknown;
};
