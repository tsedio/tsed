import {$log} from "ts-log-debug";
import {TestContext} from "./TestContext";

/**
 * Load the server silently without listening port and configure it on test profile.
 * @decorator
 * @param server
 * @param args
 * @returns {Promise<void>}
 */
export function bootstrap(server: any, ...args: any[]): () => Promise<void> {
  $log.stop();

  return function before() {
    const instance = new server(...args);

    instance.startServers = () => Promise.resolve();

    // used by inject method
    TestContext.injector = instance.injector;

    return instance.start();
  };
}
