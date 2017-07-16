import {$log} from "ts-log-debug";
/**
 * @module testing
 */
/** */
import {ServerLoader} from "../server/components/ServerLoader";

export function bootstrap(server: any, ...args) {

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


