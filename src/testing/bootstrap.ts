import {$log} from "ts-log-debug";

export const servers: Map<any, any> = new Map();

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
    if (!servers.has(server)) {
      const instance: any = new server(...args);
      instance.startServers = () => Promise.resolve();

      const promise = instance.start();
      servers.set(server, {instance, promise, isDone: false});

      promise
        .then(() => {
          servers.get(server).isDone = true;
          done();
        });
      /*.catch((er: any) => {
        servers.get(server).isDone = true;
        console.error(er);
        done(er);

        return Promise.reject(er);
      });*/
    } else {
      const conf = servers.get(server);

      /* istanbul ignore else */
      if (conf.isDone) {
        done();
      } else {
        conf.promise = conf.promise.then(done);
      }
    }
  };
}