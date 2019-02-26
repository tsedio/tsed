import {Constant, HttpServer, HttpsServer, Inject, InjectorService, OnServerReady, Provider, Service} from "@tsed/common";
import {nameOf} from "@tsed/core";
import * as SocketIO from "socket.io"; // tslint:disable-line: no-unused-variable
import {$log} from "ts-log-debug";
import {IO} from "./decorators/io";
import {ISocketProviderMetadata} from "./interfaces/ISocketProviderMetadata";
import {PROVIDER_TYPE_SOCKET_SERVICE} from "./registries/SocketServiceRegistry";
import {SocketIOService} from "./services/SocketIOService";

/**
 *
 */
@Service()
export class SocketIOModule implements OnServerReady {
  @Constant("logger.disableRoutesSummary", false)
  disableRoutesSummary: boolean;

  @Constant("socketIO", {})
  settings: SocketIO.ServerOptions;

  @Constant("httpPort")
  httpPort: string | number;

  @Constant("httpsPort")
  httpsPort: string | number;

  constructor(
    private injector: InjectorService,
    @Inject(HttpServer) private httpServer: HttpServer,
    @Inject(HttpsServer) private httpsServer: HttpsServer,
    @IO private io: SocketIO.Server,
    private socketIOService: SocketIOService
  ) {}

  $onServerReady() {
    if (this.httpPort) {
      this.io.attach(this.httpServer, {...this.settings});
    }
    if (this.httpsPort) {
      this.io.attach(this.httpsServer, {...this.settings});
    }

    if (this.settings.adapter) {
      this.io.adapter(this.settings.adapter);
    }

    this.getWebsocketServices().forEach(provider => this.socketIOService.addSocketProvider(provider));

    if (!this.disableRoutesSummary) {
      this.printSocketEvents();
    }
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
   * @param logger
   */
  protected printSocketEvents(logger: {info: (s: any) => void} = $log) {
    const list = this.getWebsocketServices().reduce((acc: any[], provider) => {
      const {handlers, namespace}: ISocketProviderMetadata = provider.store.get("socketIO");

      if (namespace) {
        Object.keys(handlers)
          .filter(key => ["$onConnection", "$onDisconnect"].indexOf(key) === -1)
          .forEach((key: string) => {
            const handler = handlers[key];
            acc.push({
              namespace,
              inputEvent: handler.eventName,
              outputEvent: (handler.returns && handler.returns.eventName) || "",
              outputType: (handler.returns && handler.returns.type) || "",
              name: `${nameOf(provider.useClass)}.${handler.methodClassName}`
            });
          });
      }

      return acc;
    }, []);

    $log.info("Socket events mounted:");

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

    logger.info("\n" + str.trim());

    $log.info("Socket server started...");
  }
}
