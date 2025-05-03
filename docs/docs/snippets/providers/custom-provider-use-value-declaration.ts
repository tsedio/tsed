import {injectable} from "@tsed/di";
import {connection} from "connection-lib";

export const CONNECTION = injectable<typeof connection>(Symbol.for("CONNECTION"))
  .value(connection)
  .hooks({
    $onDestroy(connection) {
      return connection.close();
    }
  })
  .token();

export type CONNECTION = typeof CONNECTION;
