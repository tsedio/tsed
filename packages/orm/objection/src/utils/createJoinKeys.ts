import {Metadata} from "@tsed/core";
import {Model, RelationType} from "objection";

import {isRelationshipOptsWithThrough, RelationshipOpts} from "../domain/RelationshipOpts.js";

/**
 * @ignore
 */
export function createJoinKeys(targetClass: any, targetSuper: any, propertyKey: string, relation: RelationType, opts?: RelationshipOpts) {
  const FOREIGN_MODEL = opts?.type || Metadata.getType(targetSuper, propertyKey);
  const SOURCE_MODEL_KEY = `${targetClass.tableName}.${opts?.from || targetClass.idColumn}`;
  const FOREIGN_MODEL_KEY = `${FOREIGN_MODEL.tableName}.${opts?.to || FOREIGN_MODEL.idColumn}`;

  switch (relation) {
    case Model.HasManyRelation:
    case Model.HasOneRelation:
      return {
        from: SOURCE_MODEL_KEY,
        to: `${FOREIGN_MODEL.tableName}.${opts?.to || targetClass.tableName + "Id"}`
      };
    case Model.ManyToManyRelation:
    case Model.HasOneThroughRelation:
      return {
        from: SOURCE_MODEL_KEY,
        through: (isRelationshipOptsWithThrough(opts) && opts.through) || {
          from: `${targetClass.tableName}_${FOREIGN_MODEL.tableName}.${targetClass.tableName}Id`,
          to: `${targetClass.tableName}_${FOREIGN_MODEL.tableName}.${FOREIGN_MODEL.tableName}Id`
        },
        to: FOREIGN_MODEL_KEY
      };
    case Model.BelongsToOneRelation:
    default:
      return {
        from: `${targetClass.tableName}.${opts?.from || propertyKey + "Id"}`,
        to: FOREIGN_MODEL_KEY
      };
  }
}
