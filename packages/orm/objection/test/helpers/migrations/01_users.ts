import type {Knex} from "knex";

import {createColumns} from "../../../src/index.js";
import {User} from "../models/User.js";

export function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(User.tableName, (table: Knex.TableBuilder) => {
    createColumns(table, User);
  });
}

export function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("users");
}
