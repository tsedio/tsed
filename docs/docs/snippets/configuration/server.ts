import {Configuration} from "@tsed/di";
import * as Path from "path";
import {MyController} from "./controllers/manual/MyController";

@Configuration({
  mount: {
    "/rest": [
      `./controllers/current/**/*.ts`,
      MyController // support manual import
    ],
    "/rest/v0": [
      // versioning
      `./controllers/v0/users/*.js`,
      `!./controllers/v0/groups/old/*.ts` // Exclusion
    ]
  }
})
export class Server {}
