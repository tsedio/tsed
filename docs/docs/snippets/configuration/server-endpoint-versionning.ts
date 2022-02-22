import {Configuration} from "@tsed/di";
import {resolve} from "path";

@Configuration({
  mount: {
    "/rest/v1": [`./controllers/v1/**/*.ts`],
    "/rest/v0": [`./controllers/v0/users/*.ts`, `./controllers/v0/groups/*.ts`]
  }
})
export class Server {}
