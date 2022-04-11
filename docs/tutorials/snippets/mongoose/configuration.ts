import {Configuration} from "@tsed/di";
import "@tsed/mongoose"; // import mongoose ts.ed module
import "@tsed/platform-express";

@Configuration({
  mongoose: [
    {
      id: "default", // Recommended: define default connection. All models without dbName will be assigned to this connection
      url: "mongodb://127.0.0.1:27017/default",
      connectionOptions: {}
    },
    {
      id: "db2",
      url: "mongodb://127.0.0.1:27017/db2",
      connectionOptions: {}
    }
  ]
})
export class Server {}
