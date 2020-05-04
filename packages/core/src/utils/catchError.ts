export function catchError<T extends Error>(cb: Function): T | undefined {
  try {
    cb();
  } catch (er) {
    return er;
  }
}
