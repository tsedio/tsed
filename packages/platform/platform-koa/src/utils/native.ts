import type {Middleware} from "koa";
import {createNativeMiddleware, type NativeMiddleware} from "@tsed/platform-router";

/** Marks a Koa middleware supplied to `Use*` as intentionally native. */
export function native<T extends Middleware>(handler: T): NativeMiddleware<T> {
  return createNativeMiddleware(handler);
}
