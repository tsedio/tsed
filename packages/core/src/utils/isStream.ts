export function isNodeStream(obj: any): obj is {pipe(destination: unknown): unknown} {
  return obj !== null && typeof obj === "object" && typeof obj.pipe === "function";
}

export function isWebStream(obj: any): obj is ReadableStream {
  return obj !== null && typeof obj === "object" && typeof obj.getReader === "function";
}

/**
 * Checks if an object is a Node.js stream or a standard Web ReadableStream.
 *
 * Use {@link isNodeStream} when the caller needs the Node.js `pipe()` API.
 *
 * @public
 * @since v7.0.0
 */
export function isStream(obj: any): boolean {
  return isNodeStream(obj) || isWebStream(obj);
}
