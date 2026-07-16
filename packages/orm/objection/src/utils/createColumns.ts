import "../components/createBooleanColumn.js";
import "../components/createIdColumn.js";
import "../components/createNumberColumn.js";
import "../components/createStringColumn.js";
import {JsonEntityStore, getProperties} from "@tsed/schema";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer.js";
import {Knex} from "knex";
import {getColumnCtx} from "./getColumnCtx.js";

/**
 * @ignore
 */
export function createColumn(table: Knex.TableBuilder, entity: JsonEntityStore) {
  const ctx = getColumnCtx(entity);

  if (!ColumnTypesContainer.has(ctx.columnType)) {
    throw `Column type ${ctx.columnType} isn't supported. Add function to ColumnTypesContainer to map the column with Knex`;
  }

  ColumnTypesContainer.get(ctx.columnType)!(table, ctx);
}

/**
 * @ignore
 */
export function getColumns(model: any) {
  return [...getProperties(model, {withIgnoredProps: true, objection: true, groups: false}).values()];
}

/**
 * @ignore
 */
export function createColumns(table: Knex.TableBuilder, model: any) {
  getColumns(model).map((entity) => {
    createColumn(table, entity);
  });
}
