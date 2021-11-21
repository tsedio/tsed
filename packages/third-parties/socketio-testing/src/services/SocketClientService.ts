import {Inject, Logger, OnDestroy} from "@tsed/common";
import {Configuration, Injectable} from "@tsed/di";
import {io, Socket} from "socket.io-client";

@Injectable()
export class SocketClientService implements OnDestroy {
  @Configuration()
  private settings: Configuration;

  @Inject()
  private logger: Logger;

  private clients: Map<string, Socket> = new Map();

  async get(namespace: string = "/"): Promise<Socket> {
    if (this.clients.has(namespace)) {
      return this.clients.get(namespace)!;
    }

    const {address, port} = this.settings.getHttpPort();
    const uri = `http://${address}:${port}${namespace}`;

    this.logger.info("Bind Socket.io client on:", uri);
    const client = io(uri);

    this.clients.set(namespace, client);

    await new Promise((resolve) => {
      client.on("connect", resolve as any);
    });

    this.logger.debug("Socket.io client connected...");

    return client;
  }

  $onDestroy() {
    this.clients.forEach((client) => client.close());
    this.logger.debug("Socket.io clients closed...");
  }
}
