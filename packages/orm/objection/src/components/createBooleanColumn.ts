import type {Knex} from "knex";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer";
import {ColumnCtx} from "../utils/getColumnCtx";
/**
 * @ignore
 */
export function createBooleanColumn(table: Knex.TableBuilder, {entity}: ColumnCtx) {
  table.boolean(entity.propertyName);
}

ColumnTypesContainer.set("boolean", createBooleanColumn);
