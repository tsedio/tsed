import {Configuration} from "@tsed/platform-http";
import {CalendarCtrl} from "./controllers/CalendarCtrl";

@Configuration({
  mount: {
    "/rest": `./controllers/*.ts`, // using componentScan
    // Using manual import
    "/manual": [CalendarCtrl]
  }
})
export class Server {}
