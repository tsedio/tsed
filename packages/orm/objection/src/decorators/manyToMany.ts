import {Model, ModelClassSpecifier} from "objection";

import {RelatesTo} from "./relatesTo.js";
import {RelationshipOptsWithThrough} from "../domain/RelationshipOpts.js";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function ManyToMany(type: ModelClassSpecifier, opts?: RelationshipOptsWithThrough): PropertyDecorator {
  return RelatesTo(Model.ManyToManyRelation, {...opts, type});
}
