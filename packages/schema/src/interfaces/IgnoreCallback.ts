import {JsonHookContext} from "./JsonHookContext";

export interface IgnoreCallback {
  (value: boolean, ctx: JsonHookContext): boolean;
}
