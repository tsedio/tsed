import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/socketio"; // import socketio Ts.ED module

@ServerSettings({
  rootDir: __dirname,
  socketIO: {
    // ... see configuration
  }
})
export class Server extends ServerLoader {

}
