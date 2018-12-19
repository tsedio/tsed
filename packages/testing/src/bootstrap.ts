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
