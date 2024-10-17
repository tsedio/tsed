import {Configuration, Inject, Injectable, OnDestroy} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {PlatformConfiguration} from "@tsed/platform-http";
import {io, Socket} from "socket.io-client";

@Injectable()
export class SocketClientService implements OnDestroy {
  @Configuration()
  private settings: PlatformConfiguration;

  @Inject()
  private logger: Logger;

  private clients: Map<string, Socket> = new Map();

  async get(namespace: string = "/", path?: string): Promise<Socket> {
    if (this.clients.has(namespace)) {
      return this.clients.get(namespace)!;
    }

    const {address, port} = this.settings.getHttpPort();
    const uri = `http://${address}:${port}${namespace}`;

    this.logger.info("Bind Socket.io client on:", uri);
    const client = io(uri, path ? {path} : undefined);

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
