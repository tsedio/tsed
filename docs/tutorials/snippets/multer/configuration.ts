import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/multipartfiles";
import * as Path from "path";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
  rootDir,
  mount: {
    "/rest": `${rootDir}/controllers/**/**.js`
  },
  uploadDir: `${rootDir}/custom-dir`,
  componentsScan: [
    `${rootDir}/services/**/**.js`
  ],

  multer: {
    // see multer options
  }
})
export class Server extends ServerLoader {

}
