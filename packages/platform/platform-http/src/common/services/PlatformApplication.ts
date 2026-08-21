import {ProviderScope, injectable} from "@tsed/di";
import {PlatformRouter} from "@tsed/platform-router";

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
  #nativeServers: readonly unknown[] = [];

  rawCallback(): any {}

  getApp(): App {
    return this.rawApp;
  }

  /**
   * Native servers exposed by the active host after they have started.
   * They are intentionally opaque to the portable HTTP contract and are
   * reserved for host-specific integrations such as Socket.IO.
   */
  getNativeServers<Server = unknown>(): readonly Server[] {
    return [...this.#nativeServers] as readonly Server[];
  }

  /** @internal Host bridges and the platform builder update this at lifecycle boundaries. */
  setNativeServers(servers: readonly unknown[]): this {
    this.#nativeServers = [...servers];

    return this;
  }

  callback(): (request: unknown, response: unknown) => any;
  callback<Req, Res>(request: Req, response: Res): any;
  callback(request?: unknown, response?: unknown) {
    if (request && response) {
      return this.callback()(request, response);
    }

    return this.rawCallback();
  }
}

injectable(PlatformApplication).scope(ProviderScope.SINGLETON).alias("PlatformApplication");
