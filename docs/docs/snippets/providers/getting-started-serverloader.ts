import {Configuration} from "@tsed/di";
import {CalendarsController} from "./controllers/CalendarsController";

@Configuration({
  mount: {
    "/rest": [CalendarsController]
  }
})
export class Server {}
