import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose"; // import mongoose ts.ed module

@ServerSettings({
  mongoose: {
    urls: {
      default: { // Recommended: define default connection. All models without dbName will be assigned to this connection
        url: "mongodb://127.0.0.1:27017/default",
        connectionOptions: {}
      },
      db2: {
        url: "mongodb://127.0.0.1:27017/db2",
        connectionOptions: {}
      }
    }
  }
})
export class Server extends ServerLoader {

}
