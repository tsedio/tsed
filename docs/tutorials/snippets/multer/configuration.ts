import {Configuration} from "@tsed/di";
import "@tsed/platform-express";

const rootDir = __dirname;

@Configuration({
  multer: {
    dest: `${rootDir}/../uploads`
    // see multer options
  }
})
export class Server {}
