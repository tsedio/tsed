import type {Knex} from "knex";

import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import {ColumnCtx} from "../utils/getColumnCtx.js";

/**
 * @ignore
 */
export function createNumberColumn(table: Knex.TableBuilder, {entity, options}: ColumnCtx) {
  table.decimal(entity.propertyName, options.precision, options.scale);
}

ColumnTypesContainer.set("number", createNumberColumn);
