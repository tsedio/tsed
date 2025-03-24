import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/platform-multer/express"; // or "@tsed/platform-multer/koa" or "@tsed/platform-multer/fastify"

@Configuration({
  multer: {
    dest: `./../uploads`
    // see multer options
  }
})
export class Server {}
