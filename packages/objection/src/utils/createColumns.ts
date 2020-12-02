import {getProperties, JsonEntityStore} from "@tsed/schema";
import * as Knex from "knex";
import "../components/createBooleanColumn";
import "../components/createIdColumn";
import "../components/createNumberColumn";
import "../components/createStringColumn";
import {ColumnTypesContainer} from "../services/ColumnTypesContainer";
import {getColumnCtx} from "./getColumnCtx";

export function createColumn(table: Knex.TableBuilder, entity: JsonEntityStore) {
  const ctx = getColumnCtx(entity);

  if (!ColumnTypesContainer.has(ctx.columnType)) {
    throw `Column type ${ctx.columnType} isn't supported. Add function to ColumnTypesContainer to map the column with Knex`;
  }

  ColumnTypesContainer.get(ctx.columnType)!(table, ctx);
}

export function getColumns(model: any) {
  return [...getProperties(model, {withIgnoredProps: true, objection: true, groups: false}).values()];
}

export function createColumns(table: Knex.TableBuilder, model: any) {
  getColumns(model).map((entity) => {
    createColumn(table, entity);
  });
}
