import {createTerminus} from "@godaddy/terminus";
import {Configuration, Inject, InjectorService, Module, OnInit} from "@tsed/di";
import Https from "https";
import Http from "http";

@Module()
export class TerminusModule implements OnInit {
  @Configuration()
  private configuration: Configuration;

  @Inject()
  private injector: InjectorService;

  @Inject(Http.Server)
  private httpServer: Http.Server | null;

  @Inject(Https.Server)
  private httpsServer: Https.Server | null;

  public $onInit() {
    this.mount();
  }

  private mount() {
    const {terminus} = this.configuration;
    const terminusConfig = {
      logger: this.injector.logger as any,
      healthChecks: this.getHealths(),
      onSignal: this.execShutdown("onSignal"),
      onShutdown: this.execShutdown("onShutdown"),
      beforeShutdown: this.execShutdown("beforeShutdown"),
      onSendFailureDuringShutdown: this.execShutdown("onSendFailureDuringShutdown"),
      ...terminus
    };

    if (this.httpServer) {
      createTerminus(this.httpServer, terminusConfig);
    }

    if (this.httpsServer) {
      createTerminus(this.httpsServer, terminusConfig);
    }
  }

  private getProviders(name: string) {
    return this.injector.getProviders().filter((provider) => {
      return provider.store.get(name);
    });
  }

  private getStore(name: string) {
    return this.injector
      .getProviders()
      .map((provider) => provider.store.get(name))
      .filter((x) => !!x)
      .flat();
  }

  private getHealths() {
    const healths: {[k: string]: () => Promise<any>} = {};

    this.getProviders("terminus").forEach((provider) => {
      Object.keys(provider.store.get("terminus")).forEach((name) => {
        healths[`${provider.path}${name}`] = provider.store.get("terminus")[name];
      });
    });

    return healths;
  }

  private execShutdown(name: string) {
    return async () => {
      for (const func of this.getStore(name)) {
        await func();
      }
    };
  }
}
