import {Configuration, registerProvider} from "@tsed/di";
import Knex, {Config} from "knex";
import {createConnection} from "../utils/connect";

export const OBJECTION_CONNECTION = Symbol.for("DEFAULT_CONNECTION");
export type OBJECTION_CONNECTION = Knex<any, unknown[]>;

registerProvider({
  provide: OBJECTION_CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const connectionOptions = configuration.get<Config>("knex")!;

    if (connectionOptions) {
      try {
        return createConnection(connectionOptions!);
      } catch (er) {
        // istanbul ignore next
        console.error(er);
      }
    }

    return {};
  }
});
