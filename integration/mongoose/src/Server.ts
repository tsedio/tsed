import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/mongoose";
import "@tsed/swagger";

@ServerSettings({
  rootDir: __dirname,
  acceptMimes: ["application/json"],
  port: 8000,
  httpsPort: false,
  passport: {},
  mongoose: {
    url: "mongodb://127.0.0.1:27017/example-mongoose-test"
  },
  swagger: {
    path: "/api-docs"
  },
  debug: false
})
export class Server extends ServerLoader {
  $onMountingMiddlewares(): void | Promise<any> {

    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override");

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
