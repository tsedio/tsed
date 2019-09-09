import {Configuration, registerProvider} from "@tsed/di";
import {DatabaseConnection} from "connection-lib";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(settings: Configuration) {
    const options = settings.get("myOptions");
    const connection = new DatabaseConnection(options);

    await connection.connect();

    return connection;
  }
});
