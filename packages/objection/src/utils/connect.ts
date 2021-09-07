import knex, {Knex} from "knex";
import {Model} from "objection";

export function createConnection(connectionOptions: Knex.Config): Knex {
  const connection = knex(connectionOptions);
  Model.knex(connection);

  return connection;
}
