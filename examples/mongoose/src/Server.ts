import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose";
import "@tsed/swagger";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";

@ServerSettings({
  rootDir: __dirname,
  acceptMimes: ["application/json"],
  port: process.env.POST || 8000,
  httpsPort: false,
  passport: {},
  mongoose: {
    url: process.env.mongoose_url || "mongodb://127.0.0.1:27017/example-mongoose-test"
  },
  swagger: {
    path: "/api-docs"
  },
  debug: false
})
export class Server extends ServerLoader {
  $beforeRoutesInit(): void | Promise<any> {

    this
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));

    return null;
  }
}
