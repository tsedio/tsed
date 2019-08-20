import {ServerLoader, ServerSettings} from "@tsed/common";

@ServerSettings({
  port: 3000,
  rootDir: __dirname
})
export class Server extends ServerLoader {
  $beforeRoutesInit() {

    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override"),
      cors = require("cors"),
      compression = require("compression"),
      awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

    this
      .use(compression())
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))

    this.use(awsServerlessExpressMiddleware.eventContext());
  }
}
