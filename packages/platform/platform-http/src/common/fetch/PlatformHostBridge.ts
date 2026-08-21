import type {PlatformFetchHandler} from "./PlatformFetchHandler.js";
import type {PlatformContext} from "../domain/PlatformContext.js";

/**
 * Native request and response objects attached by a host bridge for one
 * invocation. They are intentionally opaque to the portable HTTP core.
 */
export interface PlatformNativeContext<NativeRequest = unknown, NativeResponse = unknown> extends Record<string, unknown> {
  request: NativeRequest;
  response: NativeResponse;
}

/**
 * Minimal contract implemented by platform-specific hosts.
 */
export interface PlatformHostBridge<NativeRequest = unknown, NativeResponse = unknown> {
  readonly name: string;

  getContext?(native: PlatformNativeContext<NativeRequest, NativeResponse>): PlatformContext | undefined;

  createContext(native: PlatformNativeContext<NativeRequest, NativeResponse>): PlatformContext | Promise<PlatformContext>;

  writeResponse($ctx: PlatformContext, response: Response): void | Promise<void>;

  install?(handler: PlatformFetchHandler): void | Promise<void>;

  start?(): void | Promise<void>;

  stop?(): void | Promise<void>;
}
