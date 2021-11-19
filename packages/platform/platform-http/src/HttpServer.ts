import {Inject, InjectorService, Module, ProviderScope, registerProvider} from "@tsed/di";
import {createServer, Server} from "http";
import type {AddressInfo} from "net";

registerProvider({
  provide: Server,
  deps: ["PLATFORM_APPLICATION"],
  scope: ProviderScope.SINGLETON,
  global: true,
  useFactory(platformApplication: any) {
    return createServer(platformApplication.callback());
  }
});

@Module()
class HttpServerModule {
  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected server: Server;

  async $listen() {
    const {port, address} = this.injector.settings.getHttpPort();

    const options = await this.listen(port, address);

    this.injector.settings.setHttpPort(options);
    this.injector.logger.info(`Listen server on http://${address}:${options.port}`);
  }

  $onDestroy() {
    return this.server.close();
  }

  protected async listen(...args: any[]) {
    const promise = new Promise((resolve, reject) => {
      this.server.on("listening", resolve);
      this.server.on("error", reject);
    });

    this.server.listen(...args);

    await promise;

    return this.server.address() as AddressInfo;
  }
}

export {Server, HttpServerModule as ServerModule};
