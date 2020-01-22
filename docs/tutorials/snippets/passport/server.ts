import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/passport";
import * as methodOverride from "method-override";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";

const rootDir = __dirname;

@ServerSettings({
  componentsScan: [
    `${rootDir}/protocols/*{.ts,.js}` // scan protocols directory
  ],
  passport: {}
})
export class Server extends ServerLoader {
  $beforeRoutesInit() {
    this
      .use(cookieParser())
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      // @ts-ignore
      .use(session({
        secret: "mysecretkey",
        resave: true,
        saveUninitialized: true,
        // maxAge: 36000,
        cookie: {
          path: "/",
          httpOnly: true,
          secure: false,
          maxAge: null
        }
      }));
  }
}
