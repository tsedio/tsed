import {Model} from "objection";
import {RelatesTo} from "./relatesTo.js";
import {RelationshipOptsWithoutThrough} from "../domain/RelationshipOpts.js";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function BelongsToOne(opts?: RelationshipOptsWithoutThrough): PropertyDecorator {
  return RelatesTo(Model.BelongsToOneRelation, opts);
}
