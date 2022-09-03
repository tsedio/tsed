import {Model} from "objection";
import {RelatesTo} from "./relatesTo";
import {RelationshipOptsWithoutThrough} from "../domain/RelationshipOpts";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function HasOne(opts?: RelationshipOptsWithoutThrough): PropertyDecorator {
  return RelatesTo(Model.HasOneRelation, opts);
}
