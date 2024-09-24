import "@tsed/platform-express";

import {Configuration} from "@tsed/di";

@Configuration({
  multer: {
    dest: `./../uploads`
    // see multer options
  }
})
export class Server {}
