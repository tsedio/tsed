import {registerProvider} from "@tsed/di";
import {connection} from "connection-lib";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider({
  provide: CONNECTION,
  useValue: connection,
  hooks: {
    $onDestroy(connection: any) {
      return connection.close();
    }
  }
});
