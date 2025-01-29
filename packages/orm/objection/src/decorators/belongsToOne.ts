import {Model, ModelClassSpecifier} from "objection";

import {isModelClassSpecifier, RelationshipOpts, RelationshipOptsWithoutThrough} from "../domain/RelationshipOpts.js";
import {RelatesTo} from "./relatesTo.js";

/**
 *
 * @param type
 * @decorator
 * @objection
 */
export function BelongsToOne(type?: ModelClassSpecifier): PropertyDecorator;
/**
 *
 * @param opts
 * @decorator
 * @objection
 */
export function BelongsToOne(opts?: RelationshipOptsWithoutThrough): PropertyDecorator;
/**
 *
 * @param opts
 * @param type
 * @decorator
 * @objection
 */
export function BelongsToOne(type?: ModelClassSpecifier, opts?: RelationshipOptsWithoutThrough): PropertyDecorator;
/**
 *
 * @param typeOrOpts
 * @param opts
 * @decorator
 * @objection
 */
export function BelongsToOne(
  typeOrOpts?: ModelClassSpecifier | RelationshipOptsWithoutThrough,
  opts?: RelationshipOptsWithoutThrough
): PropertyDecorator {
  // For backwards compatibility
  if (!typeOrOpts && !opts) return RelatesTo(Model.BelongsToOneRelation, undefined);
  if (!typeOrOpts && opts) {
    typeOrOpts = opts;
    opts = undefined;
  }

  const options: RelationshipOpts | undefined = isModelClassSpecifier(typeOrOpts)
    ? opts
      ? {...opts, type: typeOrOpts}
      : {type: typeOrOpts}
    : typeOrOpts;

  return RelatesTo(Model.BelongsToOneRelation, options);
}
