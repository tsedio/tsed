import {Configuration} from "@tsed/di";
import {MyController} from "./controllers/rest/MyController";

@Configuration({
  mount: {
    "/rest": [MyController]
  }
})
export class Server {}
