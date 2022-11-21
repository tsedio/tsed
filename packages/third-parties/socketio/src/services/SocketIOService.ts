import {InjectorService, Provider, Service} from "@tsed/common";
import * as SocketIO from "socket.io"; // tslint:disable-line: no-unused-variable
import {SocketHandlersBuilder} from "../class/SocketHandlersBuilder";
import {SocketProviderMetadata} from "../class/SocketProviderMetadata";
import {IO} from "../decorators/io";

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

  constructor(private injector: InjectorService, @IO private io: SocketIO.Server) {}

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

        socket.on("disconnect", () => {
          conf.instances.forEach((builder: SocketHandlersBuilder) => {
            builder.onDisconnect(socket, conf.nsp);
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
