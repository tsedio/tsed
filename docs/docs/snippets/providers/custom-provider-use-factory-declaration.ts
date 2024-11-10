import {constant, injectable} from "@tsed/di";
import {DatabaseConnection, Options} from "connection-lib";

// add a new property to the Configuration interface
declare global {
  namespace TsED {
    interface Configuration extends Record<string, any> {
      database: Options;
    }
  }
}

export const CONNECTION = injectable<DatabaseConnection>(Symbol.for("CONNECTION"))
  .factory(() => {
    const options = constant<Options>("myOptions");

    return new DatabaseConnection(options);
  })
  .hooks({
    $onDestroy(connection) {
      return connection.close();
    }
  })
  .token();
