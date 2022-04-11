import {Configuration} from "@tsed/di";
import {MyController} from "./controllers/manual/MyController";

@Configuration({
  mount: {
    "/rest": [
      `./controllers/current/**/*.ts`, // deprecated
      MyController // support manual import
    ],
    "/rest/v0": [
      // versioning
      `./controllers/v0/users/*.js`, // deprecated
      `!./controllers/v0/groups/old/*.ts` // Exclusion
    ]
  }
})
export class Server {}
