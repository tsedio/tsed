import {Configuration} from "@tsed/di";
// Note: .js extension is required when using ES modules
import {CalendarsController} from "./controllers/CalendarsController.js";

@Configuration({
  mount: {
    "/rest": [CalendarsController]
  }
})
export class Server {}
