import {DecoratorParameters, Metadata, getClass} from "@tsed/core";

import {RelationType} from "objection";
import {RelationshipOpts} from "../domain/RelationshipOpts";
import {createJoinKeys} from "./createJoinKeys";

/**
 * @ignore
 */
export function createRelationshipMapping([target, propertyKey]: DecoratorParameters, relation: RelationType, opts?: RelationshipOpts) {
  return (targetClass: any) => ({
    [propertyKey]: {
      relation,
      modelClass: opts?.type || Metadata.getType(target, propertyKey),
      join: createJoinKeys(targetClass, target, String(propertyKey), relation, opts),
      modify: opts?.modify,
      filter: opts?.filter,
      beforeInsert: opts?.beforeInsert
    }
  });
}
