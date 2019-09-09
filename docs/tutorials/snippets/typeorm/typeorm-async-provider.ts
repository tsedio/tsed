import {Configuration, registerProvider} from "@tsed/di";
import {Connection, ConnectionOptions, getConnectionManager} from "typeorm";
import {ServerSettingsService} from "@tsed/common";

export const CONNECTION = Symbol.for("CONNECTION"); // declare your own
export type CONNECTION = Connection; // Set alias types (optional)

registerProvider({
  provide: CONNECTION,
  deps: [ServerSettingsService],
  async useAsyncFactory(serverSerttings: ServerSettingsService) {
    const settings = serverSerttings.get<ConnectionOptions>("customSettings")!;

    const connection = getConnectionManager().create(settings!);
    await connection.connect();

    // Add hook to close connection when server is killed
    // @ts-ignore
    connection.$onDestroy = () => connection.close();

    return connection;
  }
});
