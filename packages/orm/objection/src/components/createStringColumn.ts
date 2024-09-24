import type {Knex} from "knex";

import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import {ColumnCtx} from "../utils/getColumnCtx.js";

/**
 * @ignore
 */
export function createStringColumn(table: Knex.TableBuilder, {entity, schema}: ColumnCtx) {
  table.string(entity.propertyName, schema.maxLength);
}

ColumnTypesContainer.set("string", createStringColumn);
