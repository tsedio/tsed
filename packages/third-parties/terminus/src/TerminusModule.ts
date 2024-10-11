import {createTerminus} from "@godaddy/terminus";
import {Constant, Inject, InjectorService, Module, OnInit, Provider} from "@tsed/di";
import type {PlatformRouteDetails} from "@tsed/platform-http";
import {concatPath} from "@tsed/schema";
import Http from "http";
import Https from "https";

import {TerminusSettings} from "./interfaces/TerminusSettings.js";

@Module()
export class TerminusModule implements OnInit {
  @Constant("terminus", {})
  private settings: TerminusSettings;

  @Constant("terminus.path", "/health")
  private basePath: string;

  @Inject()
  private injector: InjectorService;

  @Inject(Http.Server)
  private httpServer: Http.Server | null;

  @Inject(Https.Server)
  private httpsServer: Https.Server | null;

  public $onInit() {
    this.mount();
  }

  getConfiguration() {
    const {path, ...props} = this.settings;

    return {
      logger: (event: string, error: any) =>
        this.injector.logger.info({
          event: event.toUpperCase(),
          error_message: error.message
        }),
      healthChecks: this.getHealths(),
      onSignal: this.createEmitter("$onSignal"),
      onShutdown: this.createEmitter("$onShutdown"),
      beforeShutdown: this.createEmitter("$beforeShutdown"),
      onSendFailureDuringShutdown: this.createEmitter("$onSendFailureDuringShutdown"),
      ...props
    };
  }

  $logRoutes(routes: PlatformRouteDetails[]): Promise<PlatformRouteDetails[]> {
    return Promise.resolve([
      ...routes,
      {
        url: this.basePath,
        method: "GET",
        name: `TerminusModule.dispatch()`
      },
      ...this.getAll<{name: string}>("health").map(({provider, propertyKey, options}) => {
        const path = this.getPath(provider, options.name);

        return {
          method: "GET",
          name: `${provider.className}.${propertyKey}()`,
          url: path
        } as any;
      })
    ]);
  }

  private mount() {
    const terminusConfig = this.getConfiguration();

    if (this.httpServer) {
      createTerminus(this.httpServer, terminusConfig);
    }

    if (this.httpsServer) {
      createTerminus(this.httpsServer, terminusConfig);
    }
  }

  private getAll<Opts = any>(
    name: string
  ): {
    provider: Provider;
    propertyKey: string;
    options: Opts;
  }[] {
    return this.injector.getProviders().flatMap((provider) => {
      const metadata = provider.store.get(`terminus:${name}`);

      if (metadata) {
        return Object.entries(metadata).map(([propertyKey, options]: [string, Opts]) => {
          return {
            provider,
            propertyKey,
            options
          };
        });
      }
      return [];
    });
  }

  private getHealths() {
    const subHealths = this.getAll<{name: string}>("health").reduce(
      (healths, {provider, propertyKey, options: {name}}) => {
        const instance = this.injector.get<any>(provider.token)!;
        const callback = async (...args: any[]) => {
          const result = await instance[propertyKey](...args);

          return {[name]: result};
        };

        let path = this.getPath(provider, name);

        return {
          ...healths,
          [path]: callback
        };
      },
      {} as Record<string, (state: any) => Promise<any>>
    );

    const healths: Record<string, any> = {
      ...subHealths,
      [this.basePath]: (state: any) => {
        const promises = Object.entries(subHealths).map(([path, callback]) => callback(state));

        return Promise.all(promises);
      }
    };

    return healths;
  }

  private getPath(provider: Provider<any>, name: string) {
    let path = concatPath(provider.path, name);
    return path.includes("health") ? path : concatPath(path, this.basePath);
  }

  private createEmitter(name: string) {
    return (...args: any[]) => {
      return this.injector.emit(name, ...args);
    };
  }
}
