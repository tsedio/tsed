import type {ErrorRequestHandler, RequestHandler} from "express";
import {createNativeMiddleware, type NativeMiddleware} from "@tsed/platform-router";

/** Marks an Express middleware supplied to `Use*` as intentionally native. */
export function native<T extends RequestHandler | ErrorRequestHandler>(handler: T): NativeMiddleware<T> {
  return createNativeMiddleware(handler);
}
