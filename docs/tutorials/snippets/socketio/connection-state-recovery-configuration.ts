import "@tsed/platform-express";
import "@tsed/socketio";

import {Configuration} from "@tsed/di";

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
