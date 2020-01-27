import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import * as Path from "path";

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
  },
  swagger: [
    {
      path: "/api-doc",
      showExplorer: true
    }
  ]
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
