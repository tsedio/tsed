import {Model, ModelClassSpecifier} from "objection";

import {RelatesTo} from "./relatesTo.js";
import {RelationshipOptsWithThrough} from "../domain/RelationshipOpts.js";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function HasMany(type: ModelClassSpecifier, opts?: RelationshipOptsWithThrough): PropertyDecorator {
  return RelatesTo(Model.HasManyRelation, {...opts, type});
}
