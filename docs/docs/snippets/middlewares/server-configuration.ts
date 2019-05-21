import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");

const rootDir = Path.resolve(__dirname);

@ServerSettings({
  rootDir,
  mount: {
    "/rest": `${rootDir}/controllers/**/**.ts`
  },
  componentsScan: [
    `${rootDir}/services/**/**.ts`,
    `${rootDir}/middlewares/**/**.ts`
  ]
})
export class Server extends ServerLoader {

}
