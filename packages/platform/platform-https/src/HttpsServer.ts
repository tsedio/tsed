import {Inject, InjectorService, Module, ProviderScope, registerProvider} from "@tsed/di";
import {createServer, Server} from "https";
import type {AddressInfo} from "net";

registerProvider({
  provide: Server,
  deps: ["PLATFORM_APPLICATION", InjectorService],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(platformApplication: any, injector: InjectorService) {
    const options = injector.settings.httpsOptions;

    return createServer(options, platformApplication.callback());
  }
});

@Module()
class HttpsServerModule {
  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected server: Server;

  async $listen() {
    const {port, address} = this.injector.settings.getHttpsPort();

    const options = await this.listen(port, address);

    this.injector.settings.setHttpsPort(options);
    this.injector.logger.info(`Listen server on https://${address}:${options.port}`);
  }

  $onDestroy() {
    return this.server.close();
  }

  async listen(...args: any[]) {
    const promise = new Promise((resolve, reject) => {
      this.server.on("listening", resolve);
      this.server.on("error", reject);
    });

    this.server.listen(...args);

    await promise;

    return this.server.address() as AddressInfo;
  }
}

export {Server, HttpsServerModule as ServerModule};
