import {Model, ModelClassSpecifier} from "objection";

import {RelatesTo} from "./relatesTo";
import {RelationshipOptsWithThrough} from "../domain/RelationshipOpts";

/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function ManyToMany(type: ModelClassSpecifier, opts?: RelationshipOptsWithThrough): PropertyDecorator {
  return RelatesTo(Model.ManyToManyRelation, {...opts, type});
}
