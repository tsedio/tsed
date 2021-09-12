import {JsonEntityStore} from "@tsed/schema";
import {ColumnOptions} from "../domain/ColumnOptions";

/**
 * @ignore
 */
export interface ColumnCtx extends ColumnOptions {
  entity: JsonEntityStore;
  schema: any;
}

/**
 * @ignore
 */
export function getColumnCtx(entity: JsonEntityStore): ColumnCtx {
  const schema = entity.schema.toJSON();
  const {columnType = schema.type, options = {}} = entity.store.get<Partial<ColumnOptions>>("objection", {});

  return {entity, columnType, options, schema};
}
