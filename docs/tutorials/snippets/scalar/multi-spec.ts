import "@tsed/platform-express";
import "@tsed/swagger"; // import swagger Ts.ED module

import {Configuration} from "@tsed/di";

@Configuration({
  swagger: [
    {
      path: "/api-docs-v1",
      doc: "api-v1"
    },
    {
      path: "/api-docs-v2",
      doc: "api-v2"
    }
  ]
})
export class Server {}
