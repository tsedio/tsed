
import {$log} from "ts-log-debug";
import {ServerLoader} from "../server/server-loader";

export function bootstrap(server: any, ...args) {

    return (done: Function) => {

        if (server.$$instance === undefined) {

            $log.setRepporting({
                debug: false,
                info: false
            });

            const instance: ServerLoader = new server(...args);

            server.$$instance = instance;

            (instance as any).startServers = function() {
                return Promise.resolve();
            };

            instance.start().then(() => done());
        } else {
            done();
        }

    }
}


