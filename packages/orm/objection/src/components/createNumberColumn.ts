import {ColumnCtx} from "../utils/getColumnCtx.js";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import type {Knex} from "knex";

/**
 * @ignore
 */
export function createNumberColumn(table: Knex.TableBuilder, {entity, options}: ColumnCtx) {
  table.decimal(entity.propertyName, options.precision, options.scale);
}

ColumnTypesContainer.set("number", createNumberColumn);
