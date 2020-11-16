import * as Knex from "knex";
import {createColumns} from "../../../src/utils/createColumns";
import {User} from "../models/User";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(User.tableName, async (table: Knex.TableBuilder) => {
    createColumns(table, User);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("users");
}