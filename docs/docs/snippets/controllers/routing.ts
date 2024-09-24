import {Configuration} from "@tsed/common";

import {CalendarCtrl} from "./controllers/CalendarCtrl";

@Configuration({
  mount: {
    "/rest": `./controllers/*.ts`, // using componentScan
    // Using manual import
    "/manual": [CalendarCtrl]
  }
})
export class Server {}
