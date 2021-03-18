import Knex from "knex";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer";
import {ColumnCtx} from "../utils/getColumnCtx";

/**
 * @ignore
 */
export function createStringColumn(table: Knex.TableBuilder, {entity, schema}: ColumnCtx) {
  table.string(entity.propertyName, schema.maxLength);
}

ColumnTypesContainer.set("string", createStringColumn);
