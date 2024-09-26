import type {Knex} from "knex";

import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import type {ColumnCtx} from "../utils/getColumnCtx.js";
/**
 * @ignore
 */
export function createBooleanColumn(table: Knex.TableBuilder, {entity}: ColumnCtx) {
  table.boolean(entity.propertyName);
}

ColumnTypesContainer.set("boolean", createBooleanColumn);
