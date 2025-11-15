import {classOf} from "./classOf.js";

/**
 * Creates a lightweight object instance that inherits from the provided value's prototype.
 *
 * If the input is a class or instance whose constructor is not Object, this function
 * returns `Object.create(obj)` to preserve the prototype chain without invoking the constructor.
 * Otherwise, it returns a plain empty object.
 *
 * @public
 * @since v7.0.0
 * @see classOf
 */
export function createInstance(obj: any) {
  return obj ? (classOf(obj) !== Object ? Object.create(obj) : {}) : {};
}
