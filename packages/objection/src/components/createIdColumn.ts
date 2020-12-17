import Knex from "knex";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer";
import {ColumnCtx} from "../utils/getColumnCtx";

export function createIdColumn(table: Knex.TableBuilder, {entity, options}: ColumnCtx) {
  if (options.type === "bigIncrements") {
    table.bigIncrements(entity.propertyName).primary();
  } else {
    table.increments(entity.propertyName).primary();
  }
}

ColumnTypesContainer.set("idColumn", createIdColumn);
