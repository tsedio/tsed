import * as Express from "express";
import {GlobalAcceptMimesMiddleware} from "../../packages/common/src/mvc/components/GlobalAcceptMimesMiddleware";
import {ServerLoader} from "../../packages/common/src/server/components/ServerLoader";
import {ServerSettings} from "../../packages/common/src/server/decorators/serverSettings";
import "../../packages/swagger/src";
import "../../packages/ajv/src";
import "./app/middlewares/authentication";
import Path = require("path");

const rootDir = Path.join(Path.resolve(__dirname), "app");

@ServerSettings({
  rootDir,
  port: 8002,
  httpsPort: 8082,
  mount: {
    "/rest": `${rootDir}/controllers/**/**.ts`
  },
  componentsScan: [`${rootDir}/services/**/**.ts`],
  serveStatic: {
    "/": `${rootDir}/views`
  },
  acceptMimes: ["application/json"],
  swagger: {
    spec: require(`${rootDir}/spec/swagger.default.json`),
    path: "/api-doc"
  }
})
export class FakeServer extends ServerLoader {
  // tslint:disable-next-line: variable-name
  static Server: FakeServer;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $onMountingMiddlewares(): void {
    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override");

    this.use(GlobalAcceptMimesMiddleware)
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());

    this.engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html");
  }

  /**
   * Set here your check authentification strategy.
   * @param request
   * @param response
   * @param next
   * @returns {boolean}
   */
  public $onAuth(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {
    return request.get("authorization") === "token";
  }
}
