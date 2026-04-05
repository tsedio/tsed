/**
 * Executes a callback and returns any thrown error, or undefined if no error occurred.
 *
 * @public
 * @since v7.0.0
 */
export function catchError<T extends Error>(cb: Function): T | undefined {
  try {
    cb();
  } catch (er) {
    return er as T;
  }
}

/**
 * Executes an async callback and returns any thrown error, or undefined if no error occurred.
 *
 * @public
 * @since v7.0.0
 */
export async function catchAsyncError<T extends Error>(cb: Function): Promise<T | undefined> {
  try {
    await cb();
  } catch (er) {
    return er as T;
  }
}
