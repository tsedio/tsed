/**
 * Returns the immediate prototype (ancestor) of the given target.
 *
 * Internally uses `Object.getPrototypeOf` to retrieve the prototype chain ancestor.
 *
 * @public
 * @since v7.0.0
 */
export function ancestorOf(target: any): any {
  return target && Object.getPrototypeOf(target);
}

/**
 * Returns the inherited class (ancestor) of the given target.
 *
 * An alias for {@link ancestorOf}.
 *
 * @public
 * @since v7.0.0
 * @see ancestorOf
 */
export function getInheritedClass(target: any): any {
  return ancestorOf(target);
}
