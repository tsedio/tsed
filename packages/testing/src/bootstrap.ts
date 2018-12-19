import {$log} from "ts-log-debug";
import {TestContext} from "./testContext";

/**
 * Load the server silently without listening port and configure it on test profile.
 * @decorator
 * @param server
 * @param args
 * @returns {(done:Function)=>undefined}
 */
export function bootstrap(server: any, ...args: any[]) {
  $log.stop();
  process.env.NODE_ENV = process.env.NODE_ENV || "test";

  return function before(done: any) {
    const instance = new server(...args);

    instance.startServers = () => Promise.resolve();

    // used by inject method
    TestContext.injector = instance.injector;

    instance
      .start()
      .then(done)
      .catch(done);
  };
}

/**
 * Load the server silently without listening port and configure it on test profile.
 * Same as `bootstrap`, but this returns a promise instead
 * @example await bootstrapAsPromised(server);
 * @decorator
 * @param server
 * @param args
 * @returns {(done:Function)=>undefined}
 */
export function bootstrapAsPromised(server: any, ...args: any[]): Promise<void> {
  return new Promise((res, rej) => {
    bootstrap(server, ...args)((err: Error) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}
