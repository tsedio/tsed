import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import session from "express-session";
import {Server} from "./Server";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const platform = await PlatformExpress.bootstrap(Server, {
        port: 8082,
        middlewares: [
          bodyParser.urlencoded({
            extended: true
          }),
          bodyParser.json(),
          cookieParser(),
          compress({}),
          methodOverride(),
          session({
            secret: "mysecretkey",
            resave: true,
            saveUninitialized: true,
            // maxAge: 36000,
            cookie: {
              path: "/",
              httpOnly: true,
              secure: false
            }
          })
        ]
      });

      await platform.listen();
      $log.debug("Server initialized");
    } catch (er) {
      console.error(er);
      $log.error(er);
    }
  }

  bootstrap();
}
