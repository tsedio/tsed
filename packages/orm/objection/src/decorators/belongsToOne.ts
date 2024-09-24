import {Model} from "objection";

import {RelationshipOptsWithoutThrough} from "../domain/RelationshipOpts.js";
import {RelatesTo} from "./relatesTo.js";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function BelongsToOne(opts?: RelationshipOptsWithoutThrough): PropertyDecorator {
  return RelatesTo(Model.BelongsToOneRelation, opts);
}
