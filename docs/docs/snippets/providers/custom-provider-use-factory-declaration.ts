import {Configuration, registerProvider} from "@tsed/di";
import {DatabaseConnection} from "connection-lib";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider<DatabaseConnection>({
  provide: CONNECTION,
  deps: [Configuration],
  useFactory(configuration: Configuration) {
    const options = configuration.get<any>("myOptions");

    return new DatabaseConnection(options);
  },
  hooks: {
    $onDestroy(connection) {
      return connection.close();
    }
  }
});
