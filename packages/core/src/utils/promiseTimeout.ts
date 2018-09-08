/**
 *
 * @param {Promise<any>} promise
 * @param {number} time
 * @returns {Promise<any>}
 */
export function promiseTimeout(promise: Promise<any>, time: number = 1000): Promise<{ok: boolean; response: any}> {
  const timeout = (promise: Promise<any>, time: number) =>
    new Promise(resolve => {
      promise.then(response => {
        resolve();

        return response;
      });
      setTimeout(() => resolve({ok: false}), time);
    });

  promise = promise.then(response => ({ok: true, response}));

  return Promise.race([promise, timeout(promise, time)]);
}
