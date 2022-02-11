import {Configuration, registerProvider} from "@tsed/di";
import {createConnection} from "@tsed/typeorm";
import {Connection, ConnectionOptions} from "typeorm";

export const CONNECTION = Symbol.for("CONNECTION"); // declare your own symbol
export type CONNECTION = Connection; // Set alias types (optional)

const CONNECTION_NAME = "default"; // change the name according to your server configuration

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const settings = configuration.get<ConnectionOptions[]>("typeorm")!;
    const connectionOptions = settings.find((o) => o.name === CONNECTION_NAME);

    return createConnection(connectionOptions!);
  }
});
