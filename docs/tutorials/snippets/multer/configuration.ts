import {Configuration} from "@tsed/common";
import "@tsed/multipartfiles";
import "@tsed/platform-express";

const rootDir = __dirname;

@Configuration({
  rootDir,
  mount: {
    "/rest": `${rootDir}/controllers/**/**.js`
  },
  componentsScan: [
    `${rootDir}/services/**/**.js`
  ],

  multer: {
    dest: `${rootDir}/uploads`
    // see multer options
  }
})
export class Server {

}
