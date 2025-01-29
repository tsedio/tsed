import {DecoratorParameters, getClass, Metadata} from "@tsed/core";
import {RelationType} from "objection";

import {isModelClassFactory, RelationshipOpts} from "../domain/RelationshipOpts.js";
import {createJoinKeys} from "./createJoinKeys.js";

/**
 * @ignore
 */
export function createRelationshipMapping([target, propertyKey]: DecoratorParameters, relation: RelationType, opts?: RelationshipOpts) {
  return (targetClass: any) => {
    opts = opts
      ? {
          ...opts,
          type: isModelClassFactory(opts.type) ? opts.type() : opts.type
        }
      : undefined;
    return {
      [propertyKey]: {
        relation,
        modelClass: opts?.type || Metadata.getType(target, propertyKey),
        join: createJoinKeys(targetClass, target, String(propertyKey), relation, opts),
        modify: opts?.modify,
        filter: opts?.filter,
        beforeInsert: opts?.beforeInsert
      }
    };
  };
}
