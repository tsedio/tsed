import {Knex} from "knex";
import {createColumns} from "../../../src";
import {User} from "../models/User";

export function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(User.tableName, (table: Knex.TableBuilder) => {
    createColumns(table, User);
  });
}

export function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("users");
}
