/**
 * Generates a random identifier string starting with 'e'.
 *
 * Uses base-36 encoding of a random number to create a unique identifier.
 *
 * @public
 * @since v7.0.0
 */
export function getRandomId() {
  return `e${Math.random().toString(36).substring(7)}`;
}
