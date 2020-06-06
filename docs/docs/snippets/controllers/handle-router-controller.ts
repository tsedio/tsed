import {Controller, PlatformRouter} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(router: PlatformRouter) {
    router.get("/", this.myMethod);
    // GET raw router (Express.Router)
    console.log(router.raw);
  }

  myMethod(req: any, res: any, next: any) {
  }
}
