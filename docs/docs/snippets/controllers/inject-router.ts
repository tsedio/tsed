import {PlatformRouter} from "@tsed/common";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(router: PlatformRouter) {
    router.get("/", this.myMethod);

    // GET raw router (Express.Router or Koa.Router)
    console.log(router.callback());
    console.log(router.raw);
    console.log(router.getRouter());
  }

  myMethod(req: any, res: any, next: any) {}
}
