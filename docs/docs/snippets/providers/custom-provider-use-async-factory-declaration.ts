import {ServerSettingsService} from "@tsed/common";
import {registerProvider} from "@tsed/di";
import {DatabaseConnection} from "connection-lib";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider({
  provide: CONNECTION,
  deps: [ServerSettingsService],
  async useAsyncFactory(settings: ServerSettingsService) {
    const options = settings.get("myOptions");
    const connection = new DatabaseConnection(options);

    await connection.connect();

    return connection;
  }
});
