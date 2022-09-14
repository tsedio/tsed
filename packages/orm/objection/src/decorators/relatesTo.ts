import {CollectionOf, Property} from "@tsed/schema";
import {RelationshipOpts, isModelClassFactory} from "../domain/RelationshipOpts";
import {StoreFn, useDecorators} from "@tsed/core";

import {OBJECTION_RELATIONSHIP_KEY} from "../utils/getJsonEntityRelationships";
import {RelationType} from "objection";
import {createRelationshipMapping} from "../utils/createRelationshipMapping";

/**
 *
 * @param relation
 * @param opts
 * @decorator
 * @objection
 */
export function RelatesTo(relation: RelationType, opts?: RelationshipOpts): PropertyDecorator {
  return useDecorators(
    opts?.type ? CollectionOf(opts.type) : Property(),
    StoreFn((store, params) => {
      if (opts && isModelClassFactory(opts.type)) {
        opts.type = opts.type();
      }
      store.set(OBJECTION_RELATIONSHIP_KEY, createRelationshipMapping(params, relation, opts));
    })
  );
}
