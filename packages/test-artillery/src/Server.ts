import {$log, ServerLoader, ServerSettings} from "@tsed/common";
import {configuration} from "./configuration";

const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");

@ServerSettings(configuration)
export class Server extends ServerLoader {
  $afterInit(): void {
    // this.use();
  }

  public $beforeRoutesInit(): void {
    // if (this.httpServer) {
    //   this.httpServer.keepAliveTimeout = 600000;
    // }
    // if (this.httpsServer) {
    //   this.httpsServer.keepAliveTimeout = 600000;
    // }
    this.use(bodyParser.json());
    this.use(cookieParser())
      .use(compression({}))
      .use(cors())
      .use(methodOverride())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }

  public $onReady(): void {
    $log.info("Server started...");
  }
}
