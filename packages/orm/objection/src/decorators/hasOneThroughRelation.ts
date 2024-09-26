import {Model} from "objection";

import type {RelationshipOptsWithThrough} from "../domain/RelationshipOpts.js";
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
