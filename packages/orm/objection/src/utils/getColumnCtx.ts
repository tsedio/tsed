import {ColumnOpts} from "../domain/ColumnOpts.js";
import {JsonEntityStore} from "@tsed/schema";

/**
 * @ignore
 */
export interface ColumnCtx extends ColumnOpts {
  entity: JsonEntityStore;
  schema: any;
}

/**
 * @ignore
 */
export function getColumnCtx(entity: JsonEntityStore): ColumnCtx {
  const schema = entity.schema.toJSON();
  const {columnType = schema.type, options = {}} = entity.store.get<Partial<ColumnOpts>>("objection", {});

  return {entity, columnType, options, schema};
}
