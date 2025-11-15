/**
 * Checks if an object is a Node.js stream by verifying the pipe method exists.
 *
 * @public
 * @since v7.0.0
 */
export function isStream(obj: any): boolean {
  return obj !== null && typeof obj === "object" && typeof obj.pipe === "function";
}
