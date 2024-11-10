import {Configuration} from "@tsed/di";
import {CalendarsController} from "./controllers/CalendarsController.js";

@Configuration({
  mount: {
    "/rest": [CalendarsController]
  }
})
export class Server {}
