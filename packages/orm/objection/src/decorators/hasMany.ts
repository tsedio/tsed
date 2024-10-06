import {Model, ModelClassSpecifier} from "objection";

import {RelationshipOptsWithThrough} from "../domain/RelationshipOpts.js";
import {RelatesTo} from "./relatesTo.js";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function HasMany(type: ModelClassSpecifier, opts?: RelationshipOptsWithThrough): PropertyDecorator {
  return RelatesTo(Model.HasManyRelation, {...opts, type});
}
