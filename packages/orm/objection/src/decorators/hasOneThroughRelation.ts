import {RelationshipOptsWithThrough, RelationshipOptsWithoutThrough} from "../domain/RelationshipOpts";

import {Model} from "objection";
import {RelatesTo} from "./relatesTo";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function HasOneThroughRelation(opts?: RelationshipOptsWithThrough): PropertyDecorator {
  return RelatesTo(Model.HasOneThroughRelation, opts);
}
