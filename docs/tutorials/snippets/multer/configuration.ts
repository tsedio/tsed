import {Configuration} from "@tsed/common";
import "@tsed/multipartfiles";
import "@tsed/platform-express";

const rootDir = __dirname;

@Configuration({
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
export class Server {

}
