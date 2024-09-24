import {Model} from "objection";

import {RelationshipOptsWithoutThrough, RelationshipOptsWithThrough} from "../domain/RelationshipOpts.js";
import {RelatesTo} from "./relatesTo.js";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function HasOneThroughRelation(opts?: RelationshipOptsWithThrough): PropertyDecorator {
  return RelatesTo(Model.HasOneThroughRelation, opts);
}
