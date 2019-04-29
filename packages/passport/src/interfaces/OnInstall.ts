import {Strategy} from "passport-strategy";

export interface OnInstall {
  $onInstall(strategy: Strategy): void;
}
