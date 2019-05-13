import {Controller, ExpressRouter} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(@ExpressRouter router: ExpressRouter) {
    router.get("/", this.myMethod);
  }

  myMethod(req: any, res: any, next: any) {
  }
}
