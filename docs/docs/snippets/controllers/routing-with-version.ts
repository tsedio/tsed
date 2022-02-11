import {Configuration} from "@tsed/di";

@Configuration({
  mount: {
    "/rest/v0": "./controllers/v0/**/*.ts",
    "/rest/v1": "./controllers/v1/**/*.ts"
  }
})
export class Server {}
