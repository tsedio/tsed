import {$log} from "ts-log-debug";
import {ServerLoader} from "../common/server/components/ServerLoader";

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

    return (done: Function) => {

        if (server.$$instance === undefined) {

            const instance: ServerLoader = new server(...args);

            server.$$instance = instance;

            (instance as any).startServers = function () {
                return Promise.resolve();
            };

            instance.start().then(() => done());
        } else {
            done();
        }

    };
}


