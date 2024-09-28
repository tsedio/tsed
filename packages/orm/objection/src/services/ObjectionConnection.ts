import {Configuration, registerProvider} from "@tsed/di";
import type {Knex} from "knex";

import {createConnection} from "../utils/connect.js";

export const OBJECTION_CONNECTION = Symbol.for("DEFAULT_CONNECTION");
export type OBJECTION_CONNECTION = Knex<any, unknown[]>;

registerProvider({
  provide: OBJECTION_CONNECTION,
  deps: [Configuration],
  useAsyncFactory(configuration: Configuration) {
    const connectionOptions = configuration.get<Knex.Config>("knex")!;

    if (connectionOptions) {
      try {
        return createConnection(connectionOptions);
      } catch (er) {
        // istanbul ignore next
        console.error(er);
      }
    }

    return Promise.resolve({});
  }
});
