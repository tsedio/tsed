import type {JsonHookContext} from "./JsonHookContext.js";

export interface IgnoreCallback {
  (value: boolean, ctx: JsonHookContext): boolean;
}
