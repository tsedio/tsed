import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/socketio";
import "@tsed/swagger";

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cons = require("consolidate");
const rootDir = __dirname;

@ServerSettings({
  rootDir,
  viewsDir: `${rootDir}/views`,
  port: 3000,
  acceptMimes: ["application/json"],
  mount: {
    "/": `${rootDir}/controllers/pages/**/*.ts`,
    "/rest": `${rootDir}/controllers/rest/**/*.ts`
  },
  statics: {
    "/": [
      "./public",
      "./node_modules"
    ]
  },
  swagger: {
    path: "/docs"
  },
  socketIO: {}
})
export class Server extends ServerLoader {
  $onInit(): void | Promise<any> {
    this.set("views", this.settings.get("viewsDir")); // le repertoire des vues
    this.engine("ejs", cons.ejs);
  }

  $beforeRoutesInit() {
    this
      .use(GlobalAcceptMimesMiddleware)
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
