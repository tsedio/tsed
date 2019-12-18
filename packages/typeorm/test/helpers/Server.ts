import {ServerLoader, ServerSettings} from "@tsed/common";
import * as Path from "path";
import "../../src/TypeORMModule";
import "./connections/ConnectionProvider";

const cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  compress = require("compression"),
  methodOverride = require("method-override");

const rootDir = Path.resolve(__dirname);

@ServerSettings({
  rootDir,
  port: 8001,
  httpsPort: false,
  logger: {
    level: "info",
    logRequest: true
  }
})
export class Server extends ServerLoader {
  public $beforeRoutesInit(): void {
    this
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());
  }
}
