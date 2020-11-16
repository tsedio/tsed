import Knex, {Config} from "knex";
import {Model} from "objection";

export function createConnection(connectionOptions: Config): Knex {
  const connection = require("knex")(connectionOptions);
  Model.knex(connection as any);

  return connection;
}
