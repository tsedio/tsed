import * as Knex from "knex";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer";
import {ColumnCtx} from "../utils/getColumnCtx";

export function createNumberColumn(table: Knex.TableBuilder, {entity, options}: ColumnCtx) {
  switch (options.type) {
    default:
    case "decimal":
      table.decimal(entity.propertyName, options.precision, options.scale);
  }
}

ColumnTypesContainer.set("number", createNumberColumn);
