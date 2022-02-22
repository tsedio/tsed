import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/socketio"; // import socket.io Ts.ED module

@Configuration({
  socketIO: {
    // ... see configuration
  }
})
export class Server {}
