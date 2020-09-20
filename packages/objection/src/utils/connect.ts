import Knex, {Config} from "knex";
import {$log} from "@tsed/logger";
import {Model as ObjectionJSModel} from 'objection'

export class Model extends ObjectionJSModel {}

export function setupObjectionJs(connectionOptions: Config) {
  const connection = createConnection(connectionOptions)
  Model.knex(connection)
  return connection
}

function createConnection(connectionOptions: Config) {
  try {
    const connection = Knex({...connectionOptions })
    return connection;
  } catch (err) {
    $log.error('Knex connection failed')
  }
}
