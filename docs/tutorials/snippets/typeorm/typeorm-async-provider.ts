import {Configuration, registerProvider} from "@tsed/di";
import {Connection, ConnectionOptions, getConnectionManager} from "typeorm";

export const CONNECTION = Symbol.for("CONNECTION"); // declare your own
export type CONNECTION = Connection; // Set alias types (optional)

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const settings = configuration.get<ConnectionOptions>("customSettings")!;

    const connection = getConnectionManager().create(settings!);
    await connection.connect();

    // Add hook to close connection when server is killed
    // @ts-ignore
    connection.$onDestroy = () => connection.close();

    return connection;
  }
});
