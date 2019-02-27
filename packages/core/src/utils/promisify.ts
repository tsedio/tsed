/**
 * Promisify a function
 * @param cb
 * @param args
 */
export function promisify<T>(cb: Function, ...args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    cb(...args, (err: any) => {
      err ? reject(err) : resolve();
    });
  });
}
