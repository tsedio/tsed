import {InjectorService, Provider, Service} from "@tsed/di";
import * as SocketIO from "socket.io"; // tslint:disable-line: no-unused-variable

import {SocketHandlersBuilder} from "../class/SocketHandlersBuilder.js";
import {SocketProviderMetadata} from "../class/SocketProviderMetadata.js";
import {IO} from "../decorators/io.js";

/**
 *
 */
@Service()
export class SocketIOService {
  /**
   *
   * @type {Map<any, any>}
   */
  private namespaces: Map<string | RegExp, {nsp: SocketIO.Namespace; instances: any}> = new Map();

  constructor(
    private injector: InjectorService,
    @IO private io: SocketIO.Server
  ) {}

  /**
   *
   * @param {string} namespace
   * @returns {SocketIO.Namespace}
   */
  public getNsp(namespace: string | RegExp = "/"): {nsp: SocketIO.Namespace; instances: any[]} {
    if (!this.namespaces.has(namespace)) {
      const conf = {nsp: this.io.of(namespace), instances: []};

      this.namespaces.set(namespace, conf);

      conf.nsp.on("connection", (socket) => {
        conf.instances.forEach((builder: SocketHandlersBuilder) => {
          builder.onConnection(socket, conf.nsp);
        });

        socket.on("disconnect", (reason: string) => {
          conf.instances.forEach((builder: SocketHandlersBuilder) => {
            builder.onDisconnect(socket, conf.nsp, reason);
          });
        });
      });
    }

    return this.namespaces.get(namespace)!;
  }

  /**
   *
   * @param {Provider<any>} provider
   */
  public addSocketProvider(provider: Provider<any>) {
    const wsConfig: SocketProviderMetadata = new SocketProviderMetadata(provider.store.get("socketIO"));

    const nspConfig = this.getNsp(wsConfig.namespace);
    const nsps = new Map();

    this.namespaces.forEach((value, nsp) => {
      nsps.set(nsp, value.nsp);
    });

    const builder = new SocketHandlersBuilder(provider, this.injector).build(nsps);

    nspConfig.instances.push(builder);
  }
}
