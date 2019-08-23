import {ServerLoader, ServerSettings} from "@tsed/common";
import * as Path from "path";
import {MyController} from "./controllers/manual/MyController";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
  rootDir, // optional. By default it's equal to process.cwd()
  mount: {
    "/rest": "${rootDir}/controllers/current/**/*.js",
    "/rest/v1": [
      "${rootDir}/controllers/v1/users/*.js",
      "${rootDir}/controllers/v1/groups/**/*.ts", // support ts entry
      "!${rootDir}/controllers/v1/groups/old/*.ts", // support ts entry
      MyController // support manual import
    ]
  }
})
export class Server extends ServerLoader {
}
