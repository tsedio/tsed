import {$log, Configuration, PlatformApplication, Inject} from "@tsed/common";
import {configuration} from "./configuration";

const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");

@Configuration(configuration)
export class Server {
  @Inject()
  app: PlatformApplication;

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
    this.app.use(bodyParser.json());
    this.app
      .use(cookieParser())
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
