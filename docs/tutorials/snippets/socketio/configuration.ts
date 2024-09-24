import "@tsed/platform-express";
import "@tsed/socketio"; // import socket.io Ts.ED module

import {Configuration} from "@tsed/di";

@Configuration({
  socketIO: {
    // ... see configuration
  }
})
export class Server {}
