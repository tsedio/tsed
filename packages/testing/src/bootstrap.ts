import {TestContext} from "./TestContext";

/**
 * Load the server silently without listening port and configure it on test profile.
 * @decorator
 * @param server
 * @param args
 * @returns {Promise<void>}
 * @deprecated
 */

/* istanbul ignore next */
export function bootstrap(server: any, ...args: any[]): () => Promise<void> {
  return TestContext.bootstrap(server, {arguments: args});
}
