import {IncomingMessage, ServerResponse} from "node:http";
import {ProviderScope, injectable} from "@tsed/di";
import {PlatformRouter} from "@tsed/platform-router";

export type PlatformNodeHandler = (req: IncomingMessage, res: ServerResponse) => any;
export type PlatformFetchHandler = (request: Request) => Response | Promise<Response>;

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
  #callback?: PlatformNodeHandler;
  #fetch?: PlatformFetchHandler;

  rawCallback() {
    return this.#callback;
  }

  rawFetch() {
    return this.#fetch;
  }

  setCallback(callback: PlatformNodeHandler) {
    this.#callback = callback;
    return this;
  }

  setFetch(fetch: PlatformFetchHandler) {
    this.#fetch = fetch;
    return this;
  }

  hasCallback() {
    return Boolean(this.#callback);
  }

  hasFetch() {
    return Boolean(this.#fetch);
  }

  getApp(): App {
    return this.rawApp;
  }

  callback(): PlatformNodeHandler;
  callback(req: IncomingMessage, res: ServerResponse): any;
  callback(req?: IncomingMessage, res?: ServerResponse) {
    const callback = this.rawCallback();

    if (!callback) {
      throw new Error("This platform does not expose a Node.js callback. Use fetch() instead.");
    }

    if (req && res) {
      return callback(req, res);
    }

    return callback;
  }

  fetch(request: Request) {
    const fetch = this.rawFetch();

    if (!fetch) {
      throw new Error("This platform does not expose a Fetch handler. Use callback() instead.");
    }

    return fetch(request);
  }
}

injectable(PlatformApplication).scope(ProviderScope.SINGLETON).alias("PlatformApplication");
