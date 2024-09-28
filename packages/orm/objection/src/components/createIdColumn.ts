import {randomUUID} from "crypto";
import type {Knex} from "knex";

import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import {ColumnCtx} from "../utils/getColumnCtx.js";

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
