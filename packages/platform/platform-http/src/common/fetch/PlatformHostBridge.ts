import type {PlatformFetchHandler} from "./PlatformFetchHandler.js";
import type {PlatformRuntimeContext} from "./PlatformRuntimeContext.js";

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

  createRequest(request: NativeRequest): Request | Promise<Request>;

  sendResponse(response: Response, native: NativeResponse): Promise<void>;

  createRuntimeContext?(native: PlatformNativeContext<NativeRequest, NativeResponse>): PlatformRuntimeContext;

  install?(handler: PlatformFetchHandler): void | Promise<void>;

  start?(): void | Promise<void>;

  stop?(): void | Promise<void>;
}
