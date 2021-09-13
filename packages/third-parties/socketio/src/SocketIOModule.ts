import {$log, AfterListen, Constant, HttpServer, HttpsServer, Inject, InjectorService, Module, OnDestroy, Provider} from "@tsed/common";
import {catchError, nameOf} from "@tsed/core";
import {Server, ServerOptions} from "socket.io";
import {SocketProviderMetadata} from "./class/SocketProviderMetadata"; // tslint:disable-line: no-unused-variable
import {PROVIDER_TYPE_SOCKET_SERVICE} from "./constants";
import {IO} from "./decorators/io";
import {SocketIOService} from "./services/SocketIOService";

/**
 * @ignore
 */
@Module()
export class SocketIOModule implements AfterListen, OnDestroy {
  @Constant("logger.disableRoutesSummary", false)
  disableRoutesSummary: boolean;

  @Constant("socketIO", {})
  settings: Partial<ServerOptions>;

  @Constant("httpPort")
  httpPort: string | number;

  @Constant("httpsPort")
  httpsPort: string | number;

  constructor(
    private injector: InjectorService,
    @Inject(HttpServer) private httpServer: HttpServer,
    @Inject(HttpsServer) private httpsServer: HttpsServer,
    @IO private io: Server,
    private socketIOService: SocketIOService
  ) {}

  $afterListen() {
    if (this.httpPort) {
      this.io.attach(this.httpServer, {...this.settings});
    }
    if (this.httpsPort) {
      this.io.attach(this.httpsServer, {...this.settings});
    }

    if (this.settings.adapter) {
      this.io.adapter(this.settings.adapter);
    }

    this.getWebsocketServices().forEach((provider) => this.socketIOService.addSocketProvider(provider));

    if (!this.disableRoutesSummary) {
      this.printSocketEvents();
    }

    return this.injector.emit("$afterSocketListen");
  }

  $onDestroy() {
    catchError(() => this.io.close());
  }

  /**
   *
   * @returns {Provider<any>[]}
   */
  protected getWebsocketServices(): Provider<any>[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_SOCKET_SERVICE));
  }

  /**
   *
   */
  protected printSocketEvents() {
    const list = this.getWebsocketServices().reduce((acc: any[], provider) => {
      const socketProvider = new SocketProviderMetadata(provider.store.get("socketIO"));

      if (socketProvider.namespace) {
        socketProvider.getHandlers().forEach((handler) => {
          acc.push({
            namespace: socketProvider.namespace,
            inputEvent: handler.eventName,
            outputEvent: (handler.returns && handler.returns.eventName) || "",
            outputType: (handler.returns && handler.returns.type) || "",
            name: `${nameOf(provider.useClass)}.${handler.methodClassName}`
          });
        });
      }

      return acc;
    }, []);

    this.injector.logger.info("Socket events mounted:");

    const str = $log.drawTable(list, {
      padding: 1,
      header: {
        namespace: "Namespace",
        inputEvent: "Input event",
        outputEvent: "Output event",
        outputType: "Output type",
        name: "Class method"
      }
    });

    this.injector.logger.info("\n" + str.trim());

    this.injector.logger.info("Socket server started...");
  }
}
