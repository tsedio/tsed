export function catchError<T extends Error>(cb: Function): T | undefined {
  try {
    cb();
  } catch (er) {
    return er;
  }
}

export async function catchAsyncError<T extends Error>(cb: Function): Promise<T | undefined> {
  try {
    await cb();
  } catch (er) {
    return er;
  }
}
