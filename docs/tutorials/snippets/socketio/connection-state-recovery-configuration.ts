import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/socketio";

@Configuration({
  socketIO: {
    // ... see configuration
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true
    }
  }
})
export class Server {}
