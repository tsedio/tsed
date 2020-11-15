import {Config} from "knex";
import {Model} from "objection";
// default import is not working
const KNEX = require("knex");

export function createConnection(connectionOptions: Config) {
  const connection = KNEX(connectionOptions);
  Model.knex(connection);

  return connection;
}
