import {configuration} from "@tsed/di";
import {CalendarsController} from "./controllers/CalendarsController.js";

export class Server {
}

configuration(Server, {
  mount: {
    "/rest": [CalendarsController]
  }
});
