import "@tsed/platform-express";
import "@tsed/swagger"; // import swagger Ts.ED module

import {Configuration} from "@tsed/di";

@Configuration({
  swagger: [
    {
      path: "/api-docs",
      jsPath: "/spec/main.js"
    }
  ]
})
export class Server {}
