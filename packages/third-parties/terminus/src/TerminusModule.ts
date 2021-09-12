import {createTerminus} from "@godaddy/terminus";
import {Configuration, HttpServer, HttpsServer, Inject, InjectorService, Module, OnInit} from "@tsed/common";

@Module()
export class TerminusModule implements OnInit {
  @Configuration()
  private configuration: Configuration;

  @Inject()
  private injector: InjectorService;

  @Inject(HttpServer)
  private httpServer: HttpServer;

  @Inject(HttpsServer)
  private httpsServer: HttpsServer;

  public $onInit() {
    this.mount(this.httpServer, this.httpsServer);
  }

  private mount(httpServer?: HttpServer, httpsServer?: HttpsServer) {
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

    if (httpServer) {
      createTerminus(httpServer, terminusConfig);
    }

    if (httpsServer) {
      createTerminus(httpsServer, terminusConfig);
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
      this.getStore(name).forEach((func) => func());
    };
  }
}
