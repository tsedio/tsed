import {ProviderScope, injectable} from "@tsed/di";
import {PlatformRouter} from "@tsed/platform-router";
import type {PlatformFetchHandler} from "../fetch/PlatformFetchHandler.js";
import type {PlatformFetchContextHandler} from "../fetch/createFetchHandler.js";

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Application {}
  }
}

/**
 * `PlatformApplication` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
export class PlatformApplication<App = TsED.Application> extends PlatformRouter {
  rawApp!: App;
  #fetchHandler?: PlatformFetchHandler;
  #fetchContextHandler?: PlatformFetchContextHandler;

  rawCallback(): any {}

  getApp(): App {
    return this.rawApp;
  }

  callback(): (request: unknown, response: unknown) => any;
  callback<Req, Res>(request: Req, response: Res): any;
  callback(request?: unknown, response?: unknown) {
    if (request && response) {
      return this.callback()(request, response);
    }

    return this.rawCallback();
  }

  /**
   * Returns the Fetch-native handler compiled during application bootstrap.
   */
  fetchHandler(): PlatformFetchHandler {
    if (!this.#fetchHandler) {
      throw new Error("The Fetch handler is available after Ts.ED route bootstrap");
    }

    return this.#fetchHandler;
  }

  /** @internal Host bridges execute this shared pipeline in an attached context. */
  fetchContextHandler(): PlatformFetchContextHandler {
    if (!this.#fetchContextHandler) {
      throw new Error("The Fetch handler is available after Ts.ED route bootstrap");
    }

    return this.#fetchContextHandler;
  }

  /** @internal PlatformBuilder installs the shared compiled route handler. */
  setFetchHandler(handler: PlatformFetchHandler, contextHandler: PlatformFetchContextHandler) {
    this.#fetchHandler = handler;
    this.#fetchContextHandler = contextHandler;
  }
}

injectable(PlatformApplication).scope(ProviderScope.SINGLETON).alias("PlatformApplication");
