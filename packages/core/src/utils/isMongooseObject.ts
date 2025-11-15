import {hasJsonMethod} from "./hasJsonMethod.js";

/**
 * Checks if an object is a MongoDB ObjectID by verifying the _bsontype property.
 *
 * @public
 * @since v7.0.0
 */
export function isObjectID(obj: any): boolean {
  return !!(obj && obj._bsontype);
}

/**
 * Checks if an object is a Mongoose model or MongoDB ObjectID.
 *
 * @public
 * @since v7.0.0
 */
export function isMongooseObject(obj: any) {
  return !!((hasJsonMethod(obj) && obj.$isMongooseModelPrototype) || isObjectID(obj));
}
