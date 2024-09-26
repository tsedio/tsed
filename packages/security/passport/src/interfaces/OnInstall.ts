import type {Strategy} from "passport";

export interface OnInstall {
  $onInstall(strategy: Strategy): void | Promise<void>;
}
