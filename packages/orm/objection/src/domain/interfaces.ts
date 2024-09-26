import type {Knex} from "knex";

declare global {
  namespace TsED {
    interface Configuration {
      knex: Knex.Config;
    }
  }
}
