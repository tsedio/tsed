import {StoreFn, useDecorators} from "@tsed/core";
import {CollectionOf, Property} from "@tsed/schema";
import {RelationType} from "objection";

import {isModelClassFactory, RelationshipOpts} from "../domain/RelationshipOpts.js";
import {createRelationshipMapping} from "../utils/createRelationshipMapping.js";
import {OBJECTION_RELATIONSHIP_KEY} from "../utils/getJsonEntityRelationships.js";

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
