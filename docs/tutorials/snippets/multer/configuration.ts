import {Configuration} from "@tsed/di";
import "@tsed/platform-express";

@Configuration({
  multer: {
    dest: `./../uploads`
    // see multer options
  }
})
export class Server {}
