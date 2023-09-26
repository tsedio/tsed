import {Configuration, registerProvider} from "@tsed/di";
import Http from "http";
import Https from "https";
import {Server, ServerOptions} from "socket.io";

export type SocketIOServer = Server;

// tslint:disable-next-line: variable-name
export const SocketIOServer = Server;

export {Server};

registerProvider({
  provide: Server,
  deps: [Http.Server, Https.Server, Configuration],
  useFactory(httpServer: Http.Server | null, httpsServer: Https.Server | null, config: Configuration) {
    const options = config.get("socketio.options");
    const adapters = config.get("socketio.adapters", []);
    const middlewares = config.get("socketio.middlewares", []);
    const builder = config.get<(options: Partial<ServerOptions>) => Server>("socketio.server", (options) => new Server(options));

    const server = builder(options);

    if (httpServer) {
      server.attach(httpServer, {...options});
    }

    if (httpsServer) {
      server.attach(httpsServer, {...options});
    }

    adapters.forEach((adapter) => {
      server.adapter(adapter);
    });

    middlewares.forEach((middleware) => {
      server.use(middleware);
    });

    return server;
  },
  hooks: {
    $onDestroy(server: Server) {
      return server.close && server.engine && new Promise((resolve) => server.close(() => resolve(undefined)));
    }
  }
});
