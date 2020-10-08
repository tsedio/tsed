import {Configuration, registerProvider} from "@tsed/di";
import {createConnection} from "@tsed/objection";
import Knex, {Config} from "knex";

export const CONNECTION = Symbol.for("DEFAULT_CONNECTION");
export type CONNECTION = ReturnType<Knex>;

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const connectionOptions = configuration.get<Config>("knex")!;

    if (connectionOptions) {
      try {
        return createConnection(connectionOptions!);
      } catch (er) {
        console.error(er);
      }
    }

    return {};
  }
});