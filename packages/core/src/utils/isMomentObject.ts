/**
 * Checks if an object is a Moment.js object by verifying the _isAMomentObject property.
 *
 * @public
 * @since v7.0.0
 */
export function isMomentObject(obj: any) {
  return !!(obj && obj?._isAMomentObject);
}
