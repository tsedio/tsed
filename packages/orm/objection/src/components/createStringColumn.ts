import {ColumnCtx} from "../utils/getColumnCtx.js";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import type {Knex} from "knex";

/**
 * @ignore
 */
export function createStringColumn(table: Knex.TableBuilder, {entity, schema}: ColumnCtx) {
  table.string(entity.propertyName, schema.maxLength);
}

ColumnTypesContainer.set("string", createStringColumn);
