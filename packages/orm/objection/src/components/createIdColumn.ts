import {ColumnCtx} from "../utils/getColumnCtx.js";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import type {Knex} from "knex";
import {randomUUID} from "crypto";

/**
 * @ignore
 */
export function createIdColumn(table: Knex.TableBuilder, {entity, options}: ColumnCtx) {
  switch (options.type) {
    case "bigIncrements":
      table.bigIncrements(entity.propertyName).primary();
      break;
    case "increments":
      table.increments(entity.propertyName).primary();
      break;
    case "uuid":
      table.uuid(entity.propertyName).primary().defaultTo(randomUUID());
  }
}

ColumnTypesContainer.set("idColumn", createIdColumn);
