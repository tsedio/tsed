import {RelationshipOptsWithThrough, RelationshipOptsWithoutThrough} from "../domain/RelationshipOpts.js";

import {Model} from "objection";
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
