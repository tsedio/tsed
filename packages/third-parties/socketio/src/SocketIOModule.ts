import {constant, inject, injectable, injector, logger, OnDestroy, Provider} from "@tsed/di";
import {Server, ServerOptions} from "socket.io";
import {$log} from "@tsed/logger";
import type {AfterListen} from "@tsed/platform-http";
import Http from "node:http";
import Https from "node:https";
import {PROVIDER_TYPE_SOCKET_SERVICE} from "./constants/constants.js";
import {SocketIOService} from "./services/SocketIOService.js";
import {SocketProviderMetadata} from "./class/SocketProviderMetadata.js";
import {nameOf} from "@tsed/core";
import {$asyncEmit} from "@tsed/hooks";

/**
 * @ignore
 */
export class SocketIOModule implements AfterListen, OnDestroy {
  protected disableRoutesSummary = constant("logger.disableRoutesSummary", false);
  protected settings = constant<Partial<ServerOptions>>("socketIO", {});
  protected httpServer = inject<Http.Server | null>(Http.Server);
  protected httpsServer = inject<Https.Server | null>(Https.Server);
  private socketIOService = inject(SocketIOService);
  private io = inject(Server);

  $afterListen() {
    if (this.httpServer) {
      this.io.attach(this.httpServer, {...this.settings});
    }

    if (this.httpsServer) {
      this.io.attach(this.httpsServer, {...this.settings});
    }

    this.getWebsocketServices().forEach((provider) => this.socketIOService.addSocketProvider(provider));

    if (!this.disableRoutesSummary) {
      this.printSocketEvents();
    }

    return $asyncEmit("$afterSocketListen");
  }

  $onDestroy() {
    return this.io?.close && this.io?.engine && new Promise((resolve) => this.io.close(() => resolve(undefined)));
  }

  /**
   *
   * @returns {Provider<any>[]}
   */
  protected getWebsocketServices(): Provider<any>[] {
    return injector().providers.getMany(PROVIDER_TYPE_SOCKET_SERVICE);
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
            outputEvent: (handler.returns && handler.returns.eventName) || handler.eventName || "",
            outputType: (handler.returns && handler.returns.type) || "",
            name: `${nameOf(provider.useClass)}.${handler.methodClassName}`
          });
        });
      }

      return acc;
    }, []);

    logger().info("Socket events mounted:");

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

    logger().info("\n" + str.trim());

    logger().info("Socket server started...");
  }
}

injectable(SocketIOModule);
