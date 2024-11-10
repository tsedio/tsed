import {connection} from "connection-lib";

export const CONNECTION = injectable<typeof connection>(Symbol.for("CONNECTION"))
  .useValue(connection)
  .hooks({
    $onDestroy(connection) {
      return connection.close();
    }
  })
  .token();
