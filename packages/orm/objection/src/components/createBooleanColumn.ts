import {ColumnCtx} from "../utils/getColumnCtx.js";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import type {Knex} from "knex";
/**
 * @ignore
 */
export function createBooleanColumn(table: Knex.TableBuilder, {entity}: ColumnCtx) {
  table.boolean(entity.propertyName);
}

ColumnTypesContainer.set("boolean", createBooleanColumn);
